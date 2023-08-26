#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, RunEvent, WindowEvent,
};

#[derive(Clone, serde::Serialize)]
struct Payload {
  args: Vec<String>,
  cwd: String,
}

fn show_window(app: &tauri::AppHandle) {
  let window = app.get_window("main").unwrap();
  window.show().unwrap();
  window.set_focus().unwrap();
}


fn main() {
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
        .system_tray(system_tray)
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);

            let window = app.get_window("main").unwrap();
            if window.is_minimized().unwrap() {
                window.maximize().unwrap();
            } else {
                show_window(app);
            }
            
            app.emit_all("single-instance", Payload { args: argv, cwd }).unwrap();
        }))
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
        .invoke_handler(tauri::generate_handler![])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

        
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
