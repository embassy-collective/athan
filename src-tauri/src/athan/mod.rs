use log::debug;
use playback_rs::{Player, Song};
use salah::prelude::{Configuration, Coordinates, Madhab, Method, PrayerSchedule, Utc};
use serde::Deserialize;
use std::path::PathBuf;
use std::sync::Arc;
use std::time;
use tauri::{api::notification::Notification, Wry};
use tauri_plugin_store::Store;
use tokio::sync::Mutex;

#[derive(Deserialize, Debug)]
pub(crate) struct Coords {
    pub(crate) latitude: f64,
    pub(crate) longitude: f64,
}
#[derive(Deserialize, Debug)]
pub(crate) struct Location {
    pub(crate) coords: Coords,
    city: String,
    country: String,
}
#[derive(Deserialize, Debug)]
pub(crate) struct Notifications {
    sunrise: bool,
    fajr: bool,
    dhuhr: bool,
    asr: bool,
    maghrib: bool,
    isha: bool,
}
#[derive(Deserialize, Debug)]
pub(crate) struct AthanSettings {
    pub(crate) agent: String,
    pub(crate) location: Location,
    pub(crate) notifications: Notifications,
    pub(crate) remindBefore: u32,
}
#[derive(Deserialize, Debug)]
pub(crate) struct State {
    pub(crate) state: AthanSettings,
    version: u8,
}

pub fn start_timer(store: Arc<Mutex<Store<Wry>>>, resources_path: PathBuf) {
    let store_clone = store.clone();

    tokio::spawn(async move {
        let mut interval = tokio::time::interval(time::Duration::from_secs(60));
        loop {
            interval.tick().await;
            let mut store_locked = store_clone.lock().await;
            check_athan_time(&mut store_locked, resources_path.clone());
        }
    });
}

pub fn check_athan_time(store: &mut Store<Wry>, resources_path: PathBuf) {
    debug!("Checking athan time.");

    store.load().expect("Failed to load settings.");

    // Deserialize the settings from the storage
    let state = store.get("athan-time-storage").unwrap();
    let parsed_state: State = serde_json::from_str(state.as_str().unwrap()).unwrap();

    // Get current location from the storage
    let location = Coordinates::new(
        parsed_state.state.location.coords.latitude,
        parsed_state.state.location.coords.longitude,
    );

    // Get prayer times for the given location
    let prayers = PrayerSchedule::new()
        .on(Utc::today())
        .for_location(location)
        .with_configuration(Configuration::with(
            Method::MuslimWorldLeague,
            Madhab::Shafi,
        ))
        .calculate()
        .expect("Failed to calculate prayer times.");

    // Get the next prayer time and the time left to it
    let next_prayer = prayers.next();

    // Check if notifications are enabled for the next prayer
    let notifications = parsed_state.state.notifications;
    let mut notify = false;

    match next_prayer {
        salah::prelude::Prayer::Fajr => {
            notify = notifications.fajr;
        }
        salah::prelude::Prayer::Sunrise => {
            notify = notifications.sunrise;
        }
        salah::prelude::Prayer::Dhuhr => {
            notify = notifications.dhuhr;
        }
        salah::prelude::Prayer::Asr => {
            notify = notifications.asr;
        }
        salah::prelude::Prayer::Maghrib => {
            notify = notifications.maghrib;
        }
        salah::prelude::Prayer::Isha => {
            notify = notifications.isha;
        }
        salah::Prayer::Qiyam => {}
        salah::Prayer::FajrTomorrow => {}
    }

    if !notify {
        debug!("Notifications are disabled for the next prayer.");
        return;
    }

    let (hours_left, minutes_left) = prayers.time_remaining();

    debug!(
        "Next prayer: {}, Time left: {} hours and {} minutes",
        next_prayer.name(),
        hours_left,
        minutes_left
    );
    debug!("Remind before: {}", parsed_state.state.remindBefore);
    let remind_bar_before = parsed_state.state.remindBefore;

    let time_remaining = minutes_left.abs_diff(remind_bar_before);
    debug!("Time left before remind: {}", time_remaining);

    // Every minute, check if the current time is one of the prayer times

    if hours_left == 0 && time_remaining <= 1 {
        debug!("Time for {}", next_prayer.name());

        Notification::new("net.thembassy.athan")
            .title("Athan Time")
            .body(format!("It's time for {}", next_prayer.name()))
            .show()
            .expect("Failed to show notification.");

        play_athan(store, resources_path);
    }
}

fn play_athan(store: &mut Store<Wry>, resources_path: PathBuf) {
    // Deserialize the settings from the storage
    let state = store.get("athan-time-storage").unwrap();
    let parsed_state: State = serde_json::from_str(state.as_str().unwrap()).unwrap();
    let player = Player::new(None).expect("Failed to open an audio output."); // Create a player to play audio with cpal.

    let song = Song::from_file(
        resources_path
            .join(format!(
                "_up_/public/audio/agents/{}.mp3",
                parsed_state.state.agent
            ))
            .to_str()
            .unwrap(),
        None,
    )
    .expect("Failed to load or decode the song."); // Decode a song from a file

    player
        .play_song_next(&song, None)
        .expect("Failed to play the other song");

    // Wait until the song has ended to exit
    while player.has_current_song() {
        std::thread::sleep(std::time::Duration::from_secs(1));
    }
}
