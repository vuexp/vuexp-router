import VuexpRouter from "./components/VuexpRouter";

export function install(Vue) {
  console.log("installing");

  const isDef = v => v !== undefined;

  Vue.mixin({
    beforeCreate() {
      if (isDef(this.$options.vuexpRouter)) {
        this._vuexpRouterRoot = this;
        this._vuexpRouter = this.$options.vuexpRouter;
        this._vuexpRouter.init(this);
      } else {
        this._vuexpRouterRoot =
          (this.$parent && this.$parent._vuexpRouterRoot) || this;
      }
    }
  });

  Object.defineProperty(Vue.prototype, "$vuexpRouter", {
    get() {
      return this._vuexpRouterRoot._vuexpRouter;
    }
  });

  Vue.component("VuexpRouter", VuexpRouter);
}
