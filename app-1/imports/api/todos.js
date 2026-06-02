import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { getTenantContext } from './tenant.js';

export const TodosCollection = new Mongo.Collection('todos');

Meteor.methods({
  async 'api/todos/find'() {
    const tenant = await getTenantContext(this.userId);
    return await TodosCollection.find({ tenant }, { sort: { createdAt: -1 } }).fetchAsync();
  },
  async 'api/todos/insert'(text) {
    if (!text || typeof text !== 'string') {
      throw new Meteor.Error('invalid-text', 'Text is required');
    }
    const tenant = await getTenantContext(this.userId);
    return await TodosCollection.insertAsync({
      text,
      checked: false,
      createdAt: new Date(),
      tenant,
      userId: this.userId,
    });
  },
  async 'api/todos/toggle'(id) {
    const tenant = await getTenantContext(this.userId);
    const todo = await TodosCollection.findOneAsync({ _id: id, tenant });
    if (!todo) {
      throw new Meteor.Error('not-found', 'Todo not found or access denied');
    }
    return await TodosCollection.updateAsync(id, {
      $set: { checked: !todo.checked },
    });
  },
  async 'api/todos/remove'(id) {
    const tenant = await getTenantContext(this.userId);
    const todo = await TodosCollection.findOneAsync({ _id: id, tenant });
    if (!todo) {
      throw new Meteor.Error('not-found', 'Todo not found or access denied');
    }
    return await TodosCollection.removeAsync(id);
  },
  async 'api/todos/clearCompleted'() {
    const tenant = await getTenantContext(this.userId);
    return await TodosCollection.removeAsync({ checked: true, tenant });
  }
});

if (Meteor.isServer) {
  // If the collection is empty for standalone, insert some default todos
  Meteor.startup(async () => {
    if (await TodosCollection.find({ tenant: 'standalone' }).countAsync() === 0) {
      await TodosCollection.insertAsync({
        text: "Standalone: Expose routing modules via Rspack Module Federation",
        checked: true,
        createdAt: new Date(),
        tenant: 'standalone',
      });
      await TodosCollection.insertAsync({
        text: "Standalone: Resolve Vue 3 compile-time feature flags warning",
        checked: true,
        createdAt: new Date(),
        tenant: 'standalone',
      });
      await TodosCollection.insertAsync({
        text: "Standalone: Fix Transition warnings for multi-root components",
        checked: true,
        createdAt: new Date(),
        tenant: 'standalone',
      });
      await TodosCollection.insertAsync({
        text: "Standalone: Implement a stunning developer Todo List dashboard in app-1",
        checked: false,
        createdAt: new Date(),
        tenant: 'standalone',
      });
    }
  });
}
