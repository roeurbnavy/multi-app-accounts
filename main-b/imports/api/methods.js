import { Meteor } from "meteor/meteor";
import { LinksCollection } from "./links";

Meteor.methods({
  'links.find': async () => {
    const data = await LinksCollection.find().fetchAsync()
    const current = Meteor.userId()
    console.log("current user in main-b: ", current)
    return data
  },
  'links.findId': async (id) => {
    const data = await LinksCollection.findOneAsync({ _id: id })
    return data
  },
  'links.insert': async (data) => {
    const res = await LinksCollection.insertAsync(data)
    return res
  },
  'links.update': async (data) => {
    return await LinksCollection.updateAsync({ _id: data._id }, { $set: data })
  },
  'links.delete': async (id) => {
    return await LinksCollection.removeAsync({ _id: id })
  }
});
