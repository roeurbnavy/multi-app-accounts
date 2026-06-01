const { defineConfig } = require("@meteorjs/rspack");
const { VueLoaderPlugin } = require("rspack-vue-loader");
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
module.exports = defineConfig((Meteor) => {
  return {
    ...Meteor.setCache(!Meteor.isProduction),
    ...(Meteor.isClient && {
      output: {
        // uniqueName is highly recommended for Module Federation HMR and chunk loading
        uniqueName: "app1",
        publicPath: process.env.PUBLIC_PATH || (Meteor.isProduction ? "auto" : "http://localhost:8081/"),
      },
      devServer: {
        port: 8081,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
      plugins: [
        new VueLoaderPlugin(),
        new DefinePlugin({
          __VUE_OPTIONS_API__: JSON.stringify(true),
          __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
          __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
        }),
        new ModuleFederationPlugin({
          name: "app1",
          filename: "remoteEntry.js",
          exposes: {
            "./router": "./imports/ui/router.js",
          },
          // remotes: {
          //   // Add remote applications here, e.g.:
          //   // remoteApp: "remoteApp@http://localhost:3001/remoteEntry.js",
          // },
          shared: {
            // Share Vue across federated modules to avoid loading multiple instances
            vue: {
              singleton: true,
              requiredVersion: "^3.3.9",
              eager: true,
            },
            "vue-router": {
              singleton: true,
              requiredVersion: "^4.2.5",
              eager: true,
            },
            vuex: {
              singleton: true,
              requiredVersion: "^4.1.0",
              eager: true,
            },
          },
        }),
      ],
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: "rspack-vue-loader",
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
