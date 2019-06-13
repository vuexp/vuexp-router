import { routeMatcher } from "../utils/routeMatcher";

export default {
  name: "RouterView",
  render(_, { props, children, parent, data }) {
    console.log("render start");

    data.routerView = true;

    const h = parent.$createElement;
    const name = props.name;
    const route = parent.$route;
    const cache = parent._routerViewCache || (parent._routerViewCache = {});

    if (route.hasOwnProperty("isBackNavigation") && route.isBackNavigation) {
      console.log("isBackNavigation:", route.isBackNavigation);
      return h();
    }

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    let depth = 0;
    let inactive = false;
    while (parent && parent._routerRoot !== parent) {
      const vnodeData = parent.$vnode && parent.$vnode.data;
      if (vnodeData) {
        if (vnodeData.routerView) {
          depth++;
        }
        if (vnodeData.keepAlive && parent._inactive) {
          inactive = true;
        }
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    let matchedRoute = routeMatcher(
      parent.$router.optimizedRoutes,
      route.path,
      depth + 1
    );
    console.log("matchedRoute");
    console.log(matchedRoute);

    const component = matchedRoute
      ? matchedRoute.optimizedRoute.component
      : null;

    if (component) {
      console.log("RENDERED:", component.name);
      return h(component, data, children);
    } else {
      return h();
    }
  },
  functional: true
};
