import { Meteor } from "meteor/meteor";
import { createApp } from "vue";
import { VueMeteor } from "vue-meteor-tracker";

import App from "./App.vue";
import { router } from "./router";
import { store } from "./store";

Meteor.startup(() => {
  const app = createApp(App);
  app.use(router);
  app.use(store);
  app.use(VueMeteor);
  app.mount("#app");
});
// Accept HMR updates
if (module.hot) {
  module.hot.accept();
}
