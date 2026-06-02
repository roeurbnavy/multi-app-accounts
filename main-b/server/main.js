import { Meteor } from 'meteor/meteor'
import { LinksCollection } from '/imports/api/links'
import { Accounts } from 'meteor/accounts-base'
import './verify-token.js'
import '/imports/api/methods.js'

async function insertLink({ title, url }) {
  await LinksCollection.insertAsync({ title, url, createdAt: new Date() })
}

Meteor.startup(async () => {
  // If the Links collection is empty, add some data.
  if ((await LinksCollection.find().countAsync()) === 0) {
    await insertLink({
      title: 'Do the Tutorial',
      url: 'https://vuejs.org/guide/quick-start.html',
    })

    await insertLink({
      title: 'Follow the Guide',
      url: 'https://guide.meteor.com',
    })

    await insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com',
    })

    await insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com',
    })
  }

  // Create default test user
  const userCount = await Meteor.users.find().countAsync();
  if (userCount === 0) {
    console.log(
      "No users found in database B. Creating default test user: admin/123456"
    );
    await Accounts.createUserAsync({
      username: "admin",
      password: "123456",
    });
  }
})
