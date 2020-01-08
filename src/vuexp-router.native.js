require("nativescript-globalevents"); // need only once in the application total
const Page = require("ui/page").Page;
import Vue from "nativescript-vue";
import { install } from "./install";

export default class VuexpRouterNative {
  static install() {}

  constructor(options) {
    if (TNS_ENV === "development") {
      console.log("VueXP Router initializing.."); //eslint-disable-line
    }
    if (
      typeof options !== "object" ||
      !options.hasOwnProperty("routes") ||
      typeof options.routes !== "object"
    ) {
      throw "Vuexp Router: Router configuration must be defined!";
    }

    this.routes = options.routes;

    this.routeHistory = [];
    this.routeIndex = 0;

    this.initDefaultRoute();
    this.handleBackButton();

    this.app = null;

    const _this = this;

    Object.defineProperty(Vue.prototype, "$router", {
      get() {
        return _this;
      }
    });

    Object.defineProperty(Vue.prototype, "$route", {
      get() {
        return _this.route;
      }
    });
    Vue.util.defineReactive(Vue.prototype, "$route", this.route);
  }

  init(app) {
    this.app = app;
  }

  routeMatcher(path) {
    if (typeof path === "string") {
      const matchedRoute = this.routes.find(item => item.path === path);
      return matchedRoute ? matchedRoute : false;
    }
    return false;
  }

  initDefaultRoute() {
    if (!this.routes.find(route => route.path === "/")) {
      throw "Missing default '/' route";
    }
    this.route = this.createRoute();
    this.routeHistory.push(this.route);
  }

  handleBackButton() {
    Page.on(Page.navigatingToEvent, event => {
      if (event.isBackNavigation) {
        if (this.routeIndex > 0) {
          this.routeIndex--;
          this.route = this.routeHistory[this.routeIndex];
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

  push(args, options) {
    const matchedRoute = this.routeMatcher(args);

    if (matchedRoute) {
      const component = matchedRoute ? matchedRoute.component : component;
      const toRoute = this.createRoute(
        matchedRoute.path,
        null,
        matchedRoute.path
      );
      this.routeIndex++;
      this.routeHistory.push(toRoute);
      this.route = toRoute;
      this.app.$navigateTo(component, options);
    } else {
      if (TNS_ENV === "development") {
        throw new Error(`Navigating to a route that does not exist: ${args}`);
      }
    }
  }

  back(...args) {
    this.app.$navigateBack(args);
  }
}

VuexpRouterNative.install = install;
