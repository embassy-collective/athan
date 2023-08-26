#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, RunEvent, WindowEvent, utils::platform::current_exe,
};
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

use window_shadows::set_shadow;
use auto_launch::{AutoLaunchBuilder};


fn show_window(app: &tauri::AppHandle) {
  let window = app.get_window("main").unwrap();
  window.show().unwrap();
  window.set_focus().unwrap();
}


fn main() {
    let dsn: &str = "https://f11c0825c73a84b52b1333cbaa892c33@o84215.ingest.sentry.io/4505771926880256";
    let client = sentry_tauri::sentry::init((
        dsn,
        sentry_tauri::sentry::ClientOptions {
            release: sentry_tauri::sentry::release_name!(),
            ..Default::default()
        },
    ));

    let _guard = sentry_tauri::minidump::init(&client);
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(hide)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    let system_tray = SystemTray::new().with_menu(tray_menu);

    let app = tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125)))
                .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

            #[cfg(any(windows, target_os = "macos"))]
            set_shadow(&window, true).unwrap();

            Ok(())
        })
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {  .. } => show_window(app),
            SystemTrayEvent::DoubleClick {  .. } => show_window(app),
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
        })
        .plugin(sentry_tauri::plugin())
        .plugin(tauri_plugin_store::Builder::default().build())
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
            },
            _ => (),
        },  
        _ => () 
  });
}
