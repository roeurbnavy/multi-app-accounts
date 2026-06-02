
import { Meteor } from "meteor/meteor";
import { LinksCollection } from "./links";
import { app1Connection } from "../remote";

Meteor.methods({
  'links.find': async () => {
    const data = await LinksCollection.find().fetchAsync()
    const current = Meteor.userId()
    console.log("current user in main: ", current)
    return data
  },
  'links.findId': async (id) => {
    const data = await LinksCollection.findOneAsync({ _id: id })
    return data
  },
  'links.insert': async (data) => {
    const res = await LinksCollection.insertAsync(data)

    if (Meteor.isServer && app1Connection) {
      try {
        const docToInsert = { ...data };
        docToInsert.title = `from main-app: ${data.title}`
        delete docToInsert._id

        await app1Connection.callAsync("api/insert", docToInsert);
      } catch (err) {
        console.error("Error calling remote api/insert:", err);
      }
    }

    return res
  },
  'links.update': async (data) => {
    return await LinksCollection.updateAsync({ _id: data._id }, { $set: data })
  },
  'links.delete': async (id) => {
    return await LinksCollection.removeAsync({ _id: id })
  }
})