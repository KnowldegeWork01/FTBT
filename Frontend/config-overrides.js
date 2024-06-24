// config-overrides.js
module.exports = function override(config, env) {
  // Override config to ignore source map warnings
  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
};
