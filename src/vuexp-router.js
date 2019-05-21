import { install } from "./install";
import Vue from "./vue";

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

    this.initCurrentRoute();

    this.routes = options.routes;
    this.optimizedRoutes = this.optimizeRoutes(this.routes);
    this.initDefaultRoute();

    this.routeHistory = [];

    this.app = null;
  }

  optimizeRoutes(routes) {
    let optimized = [];

    const buildRoute = (route, parentRoute) => {
      optimized.push({
        path: parentRoute ? parentRoute.path + "/" + route.path : route.path,
        component: route.component
      });

      if (route.children) {
        for (const child of route.children) {
          buildRoute(child, route);
        }
      }
    };

    routes.forEach(route => {
      buildRoute(route);
    });

    return optimized;
  }

  init(app) {
    this.app = app;
  }

  initDefaultRoute() {
    if (!this.optimizedRoutes.find(route => route.path === "/")) {
      throw "Missing default '/' route";
    }
  }

  initCurrentRoute() {
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

  createRoute(path, query, params, fullPath, meta) {
    return {
      path: path || "/",
      query: query || {},
      params: params || {},
      fullPath: fullPath || "/",
      meta: meta || {}
    };
  }

  getMatchedRoute(route) {}

  getRouteByPath(path) {
    //TODO add child route support
    /*
    const route = this.routes.find(item => item.path === path);

    if (!route) {
    }*/

    const route = this.optimizedRoutes.find(item => item.path === path);

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
    console.log("asdadasd");
    console.log(this.routeHistory);
    return this.routeHistory[this.routeHistory.length - 1];
  }

  get history() {
    return {
      current: {
        path: "/",
        query: {},
        params: {},
        fullPath: "/",
        meta: {}
      }
    };
  }

  push(param) {
    console.log("Push");
    if (typeof param === "string") {
      const route = this.getRouteByPath(param);
      console.log("ROUTE");
      console.log(route);

      //TODO sil
      this.localVue.vxpCurrentRoute = route;

      if (route.hasOwnProperty("component")) {
        this.routeHistory.push(route);
        this.app.$route = route;
      } else {
        throw "Component undefined";
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
