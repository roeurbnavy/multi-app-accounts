// import { Meteor } from "meteor/meteor";
// import { LinksCollection } from "/imports/api/links";

// async function insertLink({ title, url }) {
//   await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
// }

// Meteor.startup(async () => {
//   console.log("startup");
//   // If the Links collection is empty, add some data.\
//   const data = await LinksCollection.find().countAsync();
//   console.log("=== data ===", data);
//   if (data === 0) {
//     await insertLink({
//       title: "Do the Tutorial",
//       url: "https://vuejs.org/guide/quick-start.html",
//     });

//     await insertLink({
//       title: "Follow the Guide",
//       url: "https://guide.meteor.com",
//     });

//     await insertLink({
//       title: "Read the Docs",
//       url: "https://docs.meteor.com",
//     });

//     await insertLink({
//       title: "Discussions",
//       url: "https://forums.meteor.com",
//     });
//   }
// });
import "/imports/api";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import "./verify-token.js";

Meteor.startup(async () => {
  const userCount = await Meteor.users.find().countAsync();
  if (userCount === 0) {
    console.log(
      "No users found in database. Creating default test user: admin/adminadmin",
    );
    await Accounts.createUserAsync({
      username: "admin",
      password: "123456",
    });
  }
});
