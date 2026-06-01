import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const TodosCollection = new Mongo.Collection('todos');

Meteor.methods({
  async 'api/todos/find'() {
    return await TodosCollection.find({}, { sort: { createdAt: -1 } }).fetchAsync();
  },
  async 'api/todos/insert'(text) {
    if (!text || typeof text !== 'string') {
      throw new Meteor.Error('invalid-text', 'Text is required');
    }
    return await TodosCollection.insertAsync({
      text,
      checked: false,
      createdAt: new Date(),
    });
  },
  async 'api/todos/toggle'(id) {
    const todo = await TodosCollection.findOneAsync(id);
    if (!todo) {
      throw new Meteor.Error('not-found', 'Todo not found');
    }
    return await TodosCollection.updateAsync(id, {
      $set: { checked: !todo.checked },
    });
  },
  async 'api/todos/remove'(id) {
    return await TodosCollection.removeAsync(id);
  },
  async 'api/todos/clearCompleted'() {
    return await TodosCollection.removeAsync({ checked: true });
  }
});

if (Meteor.isServer) {
  // If the collection is empty, insert some default todos
  Meteor.startup(async () => {
    if (await TodosCollection.find().countAsync() === 0) {
      await TodosCollection.insertAsync({
        text: "Expose routing modules via Rspack Module Federation",
        checked: true,
        createdAt: new Date(),
      });
      await TodosCollection.insertAsync({
        text: "Resolve Vue 3 compile-time feature flags warning",
        checked: true,
        createdAt: new Date(),
      });
      await TodosCollection.insertAsync({
        text: "Fix Transition warnings for multi-root components",
        checked: true,
        createdAt: new Date(),
      });
      await TodosCollection.insertAsync({
        text: "Implement a stunning developer Todo List dashboard in app-1",
        checked: false,
        createdAt: new Date(),
      });
    }
  });
}
