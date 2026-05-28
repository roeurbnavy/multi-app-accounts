import { Meteor } from "meteor/meteor";
import { LinksCollection } from "./links";

Meteor.methods({
  "api/find": async () => {
    console.log("api/find");
    const current = Meteor.userId()
    console.log("current user in app-1: ", current)
    return await LinksCollection.find({}).fetchAsync();
  },
  "api/insert": async (doc) => {
    console.log("api/insert", doc);
    return await LinksCollection.insertAsync(doc ?? {
      title: "Test",
      url: "https://test.com",
    });
  },
  "api/update": async (id) => {
    console.log("api/update", id);
    return await LinksCollection.updateAsync(id, {
      title: "Test",
      url: "https://test.com",
    });
  },
  "api/remove": async (id) => {
    console.log("api/remove", id);
    return await LinksCollection.removeAsync(id);
  },
});