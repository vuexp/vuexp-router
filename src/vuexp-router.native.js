import { install } from "./install";

export default class VuexpRouterNative {
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

  createRoute(path, query, params, fullPath, meta) {
    return {
      path: path || "/",
      query: query || {},
      params: params || {},
      fullPath: fullPath || "/",
      meta: meta || {}
    };
  }

  getRouteByPath(path) {
    return this.optimizedRoutes.find(item => item.path === path);
  }

  getRouteByName(name) {
    return this.optimizedRoutes.find(item => item.name === name);
  }

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

      if (route.hasOwnProperty("component")) {
        this.routeHistory.push(route);
        this.app._route = route;
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

VuexpRouterNative.install = install;
