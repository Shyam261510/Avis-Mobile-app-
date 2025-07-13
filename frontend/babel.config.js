module.exports = function (api) {
  api.cache(false);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env",
          blocklist: null,
          allowlist: null,
          blacklist: null, // deprecated
          whitelist: null, // deprecated
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
    ],
  };
};
