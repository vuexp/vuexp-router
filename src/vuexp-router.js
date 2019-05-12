import { install } from "./install";

const appMode = process.env.VUE_APP_MODE;

export default class VuexpRouter {
  static install() {}

  constructor(options) {
    console.log("constructor");
    if (
      typeof options !== "object" ||
      !options.hasOwnProperty("routes") ||
      typeof options.routes !== "object"
    ) {
      throw "Vuexp Router: Router configuration must be defined!";
    }

    this.initCurrentRoute(options.Vue);

    this.routes = options.routes;

    // Register vue router to vuexp router
    this.vueRouter = null;
    if (appMode === "web") {
      if (options.hasOwnProperty("vueRouter")) {
        this.vueRouter = options.vueRouter;
      } else {
        throw "Vue router required!";
      }
    }

    this.routeHistory = [];
  }

  init(Vue) {}

  initCurrentRoute(Vue) {
    console.log("init");

    let localVue = new Vue({ data: { vxpCurrentRoute: { path: "/" } } });
    this.localVue = localVue;

    Object.defineProperties(Vue.prototype, {
      $vxpCurrentRoute: {
        get() {
          return localVue.vxpCurrentRoute;
        }
      }
    });
  }

  getRouteByPath(path) {
    //TODO add child route support
    const route = this.routes.find(item => item.path === path);

    return route;
  }

  getRouteByName(name) {}

  /*
    // literal string path
    router.push('home')
    
    // object
    router.push({ path: 'home' })
    
    // named route
    router.push({ name: 'user', params: { userId: '123' } })
    
    // with query, resulting in /register?plan=private
    router.push({ path: 'register', query: { plan: 'private' } })
   */

  updateHistory(route) {
    if (route) {
      this.routeHistory.push(route);
    }
  }

  get currentRoute() {
    return this.routeHistory[this.routeHistory.length - 1];
  }

  goTo(param) {
    console.log("Goto");
    if (typeof param === "string") {
      const route = this.getRouteByPath(param);
      console.log(route);

      this.localVue.vxpCurrentRoute = route;

      if (appMode === "web") {
        this.vueRouter.push(param);
      } else {
        if (route.hasOwnProperty("component")) {
          this.updateHistory(route);
        } else {
          throw "Component undefined";
        }
      }
    } else if (!(param instanceof Array) && param instanceof Object) {
      // literal string path
      //ex: router.push('home')
    } else {
      throw "Unsupported goTo param!";
    }
  }

  goBack() {}
}

VuexpRouter.install = install;
