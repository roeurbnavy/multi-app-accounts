const { defineConfig } = require("@meteorjs/rspack");
const { VueLoaderPlugin } = require("vue-loader");
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
module.exports = defineConfig((Meteor) => {
  return {
    ...(Meteor.isClient && {
      output: {
        // uniqueName is highly recommended for Module Federation HMR and chunk loading
        uniqueName: "main",
      },
      plugins: [
        new VueLoaderPlugin(),
        new ModuleFederationPlugin({
          name: "main",
          filename: "remoteEntry.js",
          remotes: {
            app1: "app1@http://localhost:8080/remoteEntry.js",
          },
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
