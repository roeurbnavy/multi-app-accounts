import { Meteor } from "meteor/meteor";
import { DDP } from "meteor/ddp-client";

export let app1Connection = null;

if (Meteor.isServer) {
  let remoteUrl = Meteor.settings.public?.app1ServerUrl || Meteor.settings.public?.remoteServerUrl || "http://localhost:4000";

  // if (remoteUrl.includes("localhost")) {
  //   const isDocker = process.env.MONGO_URL && process.env.MONGO_URL.includes("//mongodb:");
  //   if (isDocker) {
  //     remoteUrl = remoteUrl.replace("localhost", "app1-remote");
  //   }
  // }

  console.log(`[Server] Connecting to app-1 at ${remoteUrl}`);
  app1Connection = DDP.connect(remoteUrl);
}
