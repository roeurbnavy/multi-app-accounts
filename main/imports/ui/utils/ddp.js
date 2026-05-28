import { Meteor } from "meteor/meteor";
import { DDP } from "meteor/ddp-client";

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

  // Retrieve remote server URL from Meteor settings or fall back to localhost
  const remoteUrl = Meteor.settings.public?.[`${remoteName}ServerUrl`] || `http://localhost:${defaultPort}`;

  if (!connections[remoteName]) {
    connections[remoteName] = DDP.connect(remoteUrl);
  }

  return connections[remoteName];
}
