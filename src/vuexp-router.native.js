require("nativescript-globalevents"); // need only once in the application total
import * as application from "tns-core-modules/application"; // eslint-disable-line
import Regexp from "path-to-regexp";
import { routeMatch } from "./utils/routeMatcher";
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

    this.routeHistory = [];
    this.routeIndex = 0;

    this.initDefaultRoute();
    this.handleBackButton();

    this.app = null;

    console.log("optimized: ");
    for (const r of this.optimizedRoutes) {
      console.log(r.path + " - " + r.component.name);
      if (r.children) {
        console.log("has children");
      }
    }

    let p = routeMatch(this.optimizedRoutes, "/parent/");
    console.log(p.optimizedRoute.component.name);
  }

  optimizeRoutes(routes) {
    let optimized = [];

    const buildRoute = (route, parentRoute) => {
      let optimizedRoute = route;
      optimizedRoute.path = parentRoute
        ? parentRoute.path + "/" + route.path
        : route.path;
      optimized.push(optimizedRoute);

      if (route.children) {
        for (const child of route.children) {
          // NOTE absolute path here!
          // this allows you to leverage the component nesting without being
          // limited to the nested URL.
          // components rendered at /baz: Root -> Parent -> Baz
          if (child.path.startsWith("/")) {
            buildRoute(child);
          } else {
            buildRoute(child, route);
          }
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
      throw "Missing default '/' route1";
    }
    const defaultRoute = this.createRoute();
    this.routeHistory.push(defaultRoute);
  }

  handleBackButton() {
    if (application.android) {
      application.android.on(
        application.AndroidApplication.activityBackPressedEvent,
        data => {
          //console.log("handle back button");
          //console.log("can go back:", this.canGoBack());
          data.cancel = true;

          if (this.canGoBack()) {
            this.back();
          } else {
            this.exit();
          }
        }
      );
    }
  }

  canGoBack() {
    const targetIndex = this.routeIndex - 1;

    return !(targetIndex < 0 || targetIndex >= this.routeHistory.length);
  }

  exit() {
    if (application.android) {
      application.android.foregroundActivity.finish();
    } else if (application.ios) {
      exit(0);
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
    router.push('home') --supported
    
    // object
    router.push({ path: 'home' }) --supported
    
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

  createRouteRecord(route, path, query, params, meta) {
    return {
      route: route,
      component: route.component,
      name: route.name,
      path: path,
      query: query,
      params: params,
      fullPath: path,
      meta: meta
    };
  }

  push(param) {
    console.log("Push", param);
    let path;
    let query = {};
    let params = {};
    let meta = {};
    let useNames = false;
    if (typeof param === "string") {
      // TODO check route params in string -- /user/evan -> /user/:username
      path = param;
    } else if (!(param instanceof Array) && param instanceof Object) {
      if (param.hasOwnProperty("path")) {
        path = param.path;
      } else if (param.hasOwnProperty("name")) {
        useNames = true;

        if (param.hasOwnProperty("params")) {
          params = param.params;
        }
      }
    } else {
      throw "Unsupported goTo param!";
    }

    //console.log("params", params);

    // Finding Route
    let route;

    if (useNames) {
      route = this.getRouteByName(param.name);
      console.log("named route");
      console.log(route);
    } else {
      route = this.getRouteByPath(path);
    }

    if (!route) {
      for (const optimizedRoute of this.optimizedRoutes) {
        let keys = [];
        const regexp = Regexp(optimizedRoute.path, keys);

        const regexpResult = regexp.exec(param);
        if (regexpResult) {
          //console.log("FOUND");
          route = optimizedRoute;

          for (const index in keys) {
            const key = keys[index];
            params[key.name] = regexpResult[parseInt(index) + 1];
          }
        }
        //console.log("params:", params);
      }
    }

    //console.log("route", route);

    if (route && route.hasOwnProperty("component")) {
      console.log("routeRecord found");
      let routeRecord = this.createRouteRecord(
        route,
        path ? path : route.path,
        query,
        params,
        meta
      );
      //console.log("routeRecord", routeRecord);
      if (routeRecord.component) {
        //console.log("componenntt");
      }
      this.routeHistory = this.routeHistory
        .slice(0, this.routeIndex + 1)
        .concat(routeRecord);
      this.routeIndex++;

      this.app._route = routeRecord;
    } else {
      throw "Component undefined";
    }
  }

  go(n) {
    const targetIndex = this.routeIndex + n;
    if (targetIndex < 0 || targetIndex >= this.routeHistory.length) {
      return;
    }
    let route = this.routeHistory[targetIndex];
    this.routeIndex = targetIndex;
    this.app._route = route;
  }

  back() {
    this.go(-1);
  }

  forward() {
    this.go(1);
  }
}

VuexpRouterNative.install = install;
