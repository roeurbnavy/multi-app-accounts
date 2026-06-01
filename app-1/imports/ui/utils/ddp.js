import { Meteor } from "meteor/meteor";
import { DDP } from "meteor/ddp-client";
import { Accounts } from "meteor/accounts-base";
import { Tracker } from "meteor/tracker";

const connections = {};

/**
 * Gets or establishes a DDP connection to a remote Meteor application.
 *
 * @param {string} remoteName - Name of the remote (e.g. 'app1')
 * @param {number} defaultPort - Fallback port for local development
 * @returns {object} The Meteor or DDP connection instance
 */
export function getRemoteConnection(remoteName, defaultPort) {
  // If we are running in the browser and the active port matches the remote's default port,
  // we are running the remote standalone, so we should use the local Meteor instance directly.
  if (
    typeof window !== "undefined" &&
    window.location.port === String(defaultPort)
  ) {
    return Meteor;
  }
  console.log("Meteor.settings.public", Meteor.settings.public);
  if (!connections[remoteName]) {
    const remoteUrl =
      Meteor.settings.public?.[`${remoteName}ServerUrl`] ||
      `http://localhost:${defaultPort}`;
    console.log("remoteUrl", remoteUrl);
    const conn = DDP.connect(remoteUrl);
    connections[remoteName] = conn;

    // Reactively sync auth token to the remote DDP connection
    if (typeof window !== "undefined") {
      Tracker.autorun(() => {
        const isLoggingIn = Meteor.loggingIn();
        const userId = Meteor.userId();
        const token = Accounts._storedLoginToken();

        if (!isLoggingIn) {
          if (userId && token) {
            conn.call("login", { resume: token }, (err) => {
              if (err) {
                console.error(`[DDP ${remoteName}] Auth sync failed:`, err);
              } else {
                console.log(`[DDP ${remoteName}] Auth sync successful.`);
              }
            });
          } else {
            conn.call("logout");
          }
        }
      });
    }
  }

  return connections[remoteName];
}
