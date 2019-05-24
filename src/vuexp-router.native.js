require("nativescript-globalevents"); // need only once in the application total
const Page = require("ui/page").Page;
import * as application from "tns-core-modules/application"; // eslint-disable-line
import { topmost } from "tns-core-modules/ui/frame";
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
      throw "Missing default '/' route1";
    }
    const defaultRoute = this.createRoute();
    this.routeHistory.push(defaultRoute);
  }

  handleBackButton() {
    if (application.ios) {
      Page.on(Page.navigatingToEvent, event => {
        if (event.isBackNavigation) {
          console.log("routeIndex", this.routeIndex);

          this.routeIndex--;

          let route = this.routeHistory[this.routeIndex];
          route.isBackNavigation = true;
          this.app._route = route;
        }
      });
    }
    if (application.android) {
      Page.on(Page.navigatingToEvent, event => {
        if (event.isBackNavigation) {
          console.log("routeIndex", this.routeIndex);

          this.routeIndex--;

          let route = this.routeHistory[this.routeIndex];
          route.isBackNavigation = true;
          this.app._route = route;
        }
      });
      /*
      application.android.on(
        application.AndroidApplication.activityBackPressedEvent,
        data => {
          console.log("handle back button");
          console.log("can go back:", this.canGoBack());
          data.cancel = true;

          if (this.canGoBack()) {
            this.back();
          } else {
            this.exit();
          }
        }
      );

       */
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
        this.routeHistory = this.routeHistory
          .slice(0, this.routeIndex + 1)
          .concat(route);
        this.routeIndex++;

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
    console.log("history:");
    for (const route of this.routeHistory) {
      console.log(route.path);
    }
    console.log("routeIndex:", this.routeIndex);
  }

  go(n) {
    console.log("routeIndex:", this.routeIndex);
    const targetIndex = this.routeIndex + n;
    if (targetIndex < 0 || targetIndex >= this.routeHistory.length) {
      return;
    }
    let route = this.routeHistory[targetIndex];
    route.isBackNavigation = false;
    if (n === -1) {
      route.isBackNavigation = true;
    }
    this.routeIndex = targetIndex;
    this.app._route = route;

    console.log("history:");
    for (const route of this.routeHistory) {
      console.log(route.path);
    }
    console.log("routeIndex1:", this.routeIndex);
  }

  back() {
    topmost().goBack();
    //this.go(-1);
  }

  forward() {
    this.go(1);
  }
}

VuexpRouterNative.install = install;
