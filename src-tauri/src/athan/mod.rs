use log::debug;
use salah::prelude::{Configuration, Coordinates, Madhab, Method, Prayer, PrayerSchedule, Utc};
use serde::Deserialize;
use tauri::Wry;
use tauri_plugin_store::Store;

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
    pub(crate) onboarding: bool,
    pub(crate) theme: String,
    pub(crate) volume: u8,
    pub(crate) twentyFourHourTime: bool,
    pub(crate) gamify: bool,
    pub(crate) remindBefore: u8,
    pub(crate) agent: String,
    pub(crate) location: Location,
    pub(crate) notifications: Notifications,
}

#[derive(Deserialize, Debug)]
pub(crate) struct State {
    pub(crate) state: AthanSettings,
    version: u8,
}

pub fn monitor_athan_times(store: &mut Store<Wry>) {
    store.load().expect("Failed to load settings.");

    // Deserialize the settings from the storage
    let state = store.get("athan-time-storage").unwrap();
    let state_test = state.as_str().unwrap();

    debug!("state_test: {}", state_test);

    let parsed_state: State = serde_json::from_str(state.as_str().unwrap()).unwrap();
    // Get current location from the storage
    let location = Coordinates::new(
        parsed_state.state.location.coords.latitude,
        parsed_state.state.location.coords.longitude,
    );

    let params = Configuration::with(Method::MuslimWorldLeague, Madhab::Shafi);

    let prayers = PrayerSchedule::new()
        .on(Utc::today())
        .for_location(location)
        .with_configuration(params)
        .calculate();

    // Get prayer times for the given location
    match prayers {
        Ok(prayer) => {
            println!(
                "{}: {}",
                Prayer::Fajr.name(),
                prayer.time(Prayer::Fajr).format("%-l:%M %p").to_string()
            );
            println!(
                "{}: {}",
                Prayer::Sunrise.name(),
                prayer.time(Prayer::Sunrise).format("%-l:%M %p").to_string()
            );
            println!(
                "{}: {}",
                Prayer::Dhuhr.name(),
                prayer.time(Prayer::Dhuhr).format("%-l:%M %p").to_string()
            );
            println!(
                "{}: {}",
                Prayer::Asr.name(),
                prayer.time(Prayer::Asr).format("%-l:%M %p").to_string()
            );
            println!(
                "{}: {}",
                Prayer::Maghrib.name(),
                prayer.time(Prayer::Maghrib).format("%-l:%M %p").to_string()
            );
            println!(
                "{}: {}",
                Prayer::Isha.name(),
                prayer.time(Prayer::Isha).format("%-l:%M %p").to_string()
            );
            println!(
                "{}: {}",
                Prayer::Qiyam.name(),
                prayer.time(Prayer::Qiyam).format("%-l:%M %p").to_string()
            );
        }
        Err(error) => println!("Could not calculate prayer times: {}", error),
    }

    // Every minute, check if the current time is one of the prayer times
    // If it is, show a notification
}
