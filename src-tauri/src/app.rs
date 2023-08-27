#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Arc;

use log::debug;
use serde::Serialize;
use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
};
use tauri_plugin_store::StoreBuilder;
use window_shadows::set_shadow;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

use crate::athan::start_timer;

#[derive(Clone, Serialize)]
pub struct Payload {
    pub args: Vec<String>,
    pub cwd: String,
}

pub fn show_window(app: &tauri::AppHandle) {
    let window = app.get_window("main").unwrap();
    window.show().unwrap();
    window.set_focus().unwrap();
}

pub fn configure_sentry() {
    let client = sentry_tauri::sentry::init((
        "https://f11c0825c73a84b52b1333cbaa892c33@o84215.ingest.sentry.io/4505771926880256",
        sentry_tauri::sentry::ClientOptions {
            release: sentry_tauri::sentry::release_name!(),
            ..Default::default()
        },
    ));

    let _guard = sentry_tauri::minidump::init(&client);
}

pub fn configure_system_tray() -> SystemTray {
    let system_tray = SystemTray::new().with_menu(
        SystemTrayMenu::new()
            .add_item(CustomMenuItem::new("show".to_string(), "Show"))
            .add_item(CustomMenuItem::new("hide".to_string(), "Hide"))
            .add_native_item(SystemTrayMenuItem::Separator)
            .add_item(CustomMenuItem::new("quit".to_string(), "Quit")),
    );

    return system_tray;
}

pub fn register_system_tray() -> impl Fn(&tauri::AppHandle, SystemTrayEvent) {
    |app, event| match event {
        SystemTrayEvent::LeftClick { .. } => show_window(app),
        SystemTrayEvent::DoubleClick { .. } => show_window(app),
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "quit" => {
                std::process::exit(0);
            }
            "hide" => {
                let window = app.get_window("main").unwrap();
                window.hide().unwrap();
            }
            "show" => show_window(app),
            _ => {}
        },
        _ => {}
    }
}

pub fn setup_app() -> impl Fn(&mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    |app| {
        let window = app.get_window("main").unwrap();

        #[cfg(target_os = "macos")]
        apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
            .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

        #[cfg(target_os = "windows")]
        apply_blur(&window, Some((18, 18, 18, 125)))
            .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

        #[cfg(any(windows, target_os = "macos"))]
        set_shadow(&window, true).unwrap();

        let data_path = app.path_resolver().app_data_dir().unwrap();
        let settings_path = data_path.join(".settings.json");

        // Fetch the storage
        let store = StoreBuilder::new(app.handle(), settings_path).build();
        let store_mutex = Arc::new(tokio::sync::Mutex::new(store));
        let resource_path = app
            .path_resolver()
            .resolve_resource("")
            .expect("failed to resolve resource");
        debug!("Resource path: {:?}", resource_path);

        start_timer(store_mutex, resource_path);

        Ok(())
    }
}
