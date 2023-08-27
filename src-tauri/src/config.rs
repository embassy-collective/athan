use config::Config;

pub fn load_config() -> Config {
    let config = Config::builder()
        .add_source(config::File::with_name("src/config"))
        .build()
        .unwrap();

    return config;
}
