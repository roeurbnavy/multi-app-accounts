const { defineConfig } = require("@meteorjs/rspack");
const { VueLoaderPlugin } = require("vue-loader");
const { DefinePlugin } = require("@rspack/core");
const {
  ModuleFederationPlugin,
} = require("@module-federation/enhanced/rspack");

/**
 * Rspack configuration for Meteor projects.
 *
 * Provides typed flags on the `Meteor` object, such as:
 * - `Meteor.isClient` / `Meteor.isServer`
 * - `Meteor.isDevelopment` / `Meteor.isProduction`
 * - …and other flags available
 *
 * Use these flags to adjust your build settings based on environment.
 */
// List of remote apps for Module Federation. Add any new remotes here.
const REMOTES_CONFIG = {
  app1: { envVar: "REMOTE_APP1_URL", defaultPort: 8081 },
};

module.exports = defineConfig((Meteor) => {
  // Generate the remotes object dynamically from the config
  const remotes = {};
  for (const [name, config] of Object.entries(REMOTES_CONFIG)) {
    let url =
      process.env[config.envVar] || `http://localhost:${config.defaultPort}`;
    // Guard: If the URL doesn't start with a protocol or double slashes, prepend http://
    if (url && !/^https?:\/\//i.test(url) && !/^\/\//.test(url)) {
      url = `http://${url}`;
    }
    remotes[name] = `${name}@${url}/remoteEntry.js`;
  }
  console.log("remotes", remotes);
  return {
    ...Meteor.setCache(!Meteor.isProduction),
    ...(Meteor.isClient && {
      output: {
        // uniqueName is highly recommended for Module Federation HMR and chunk loading
        uniqueName: "main",
      },
      plugins: [
        new VueLoaderPlugin(),
        new DefinePlugin({
          __VUE_OPTIONS_API__: JSON.stringify(true),
          __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
          __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
        }),
        new ModuleFederationPlugin({
          name: "main",
          filename: "remoteEntry.js",
          remotes,
          // remotes: {
          //   app1: "app1@http://5.223.49.73:4000/remoteEntry.js",
          // },
          shared: {
            vue: {
              singleton: true,
              requiredVersion: "^3.3.9",
            },
            "vue-router": {
              singleton: true,
              requiredVersion: "^4.2.5",
            },
          },
        }),
      ],
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: "vue-loader",
            options: {
              // Note, for the majority of features to be available, make sure this option is `true`
              experimentalInlineMatchResource: true,
            },
          },
          {
            test: /\.css$/,
            use: ["postcss-loader"],
            type: "css",
          },
        ],
      },
    }),
  };
});
