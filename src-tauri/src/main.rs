#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::app::{
    configure_sentry, configure_system_tray, register_system_tray, setup_app, show_window, Payload,
};
use auto_launch::AutoLaunchBuilder;
use tauri::{utils::platform::current_exe, Manager, RunEvent, WindowEvent};

pub mod app;
pub mod athan;

#[tokio::main] // Initialize the Tokio runtime
async fn main() {
    configure_sentry();

    let app = tauri::Builder::default()
        .setup(setup_app())
        .system_tray(configure_system_tray())
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            let window = app.get_window("main").unwrap();
            if window.is_minimized().unwrap() {
                window.maximize().unwrap();
            } else {
                show_window(app);
            }
            app.emit_all("single-instance", Payload { args: argv, cwd })
                .unwrap();
        }))
        .on_system_tray_event(register_system_tray())
        .plugin(sentry_tauri::plugin())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_log::Builder::default().build())
        .invoke_handler(tauri::generate_handler![])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    let app_exe = current_exe().unwrap();
    let app_exe = dunce::canonicalize(app_exe).unwrap();
    let app_name = app_exe.file_stem().unwrap().to_str().unwrap();
    let app_path = app_exe.as_os_str().to_str().unwrap();

    let auto = AutoLaunchBuilder::new()
        .set_app_name(app_name)
        .set_app_path(app_path)
        .set_use_launch_agent(true)
        .build()
        .unwrap();

    let already_configured = auto.is_enabled().unwrap();

    if !already_configured {
        auto.enable().unwrap();
    }

    app.run(|app_handle, event| match event {
        RunEvent::WindowEvent { label, event, .. } => match event {
            WindowEvent::CloseRequested { api, .. } => {
                api.prevent_close();
                let window = app_handle.get_window(&label).unwrap();
                window.hide().unwrap();
            }
            _ => (),
        },
        _ => (),
    });
}
