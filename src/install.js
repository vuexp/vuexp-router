import RouterView from "./components/RouterView.vue";
import RouterLink from "./components/RouterLink.js";

export function install(Vue) {
  const isDef = v => v !== undefined;

  Vue.mixin({
    beforeCreate() {
      if (isDef(this.$options.router)) {
        this.$options.router.init(this);
      }
    }
  });

  Vue.component("RouterView", RouterView);
  Vue.component("RouterLink", RouterLink);
}
