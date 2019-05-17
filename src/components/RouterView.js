export default {
  name: "RouterView",
  functional: true,
  render(_, { props, children, parent, data }) {
    const routes = parent.$router.routes;

    const h = parent.$createElement;

    data.routerView = true;

    //const h = parent.$createElement;
    const name = props.name;
    const route = parent.$route;
    const cache = parent._routerViewCache || (parent._routerViewCache = {});

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

    console.log("routerView");
    console.log(route);

    //debugger;

    const optimizedRoute = parent.$router.optimizedRoutes.find(
      item => item.path === route.path
    );

    if (!optimizedRoute) {
      return h();
    }

    console.log(optimizedRoute);

    const pathArray = optimizedRoute.path.split("/").filter(Boolean);

    console.log(pathArray);

    let depthPath = "/";

    for (let i = 0; i <= depth; i++) {
      depthPath += pathArray[i] + "/";
    }
    depthPath = depthPath.slice(0, -1);

    console.log(depthPath);

    let matched;

    if (!pathArray.length) {
      matched = optimizedRoute;
    } else {
      matched = parent.$router.optimizedRoutes.find(
        item => item.path === depthPath
      );
    }

    console.warn("Rendered: " + matched.component.name);

    //const matchedRoute = !pathArray.length ? route.optimizedRoutes.find(item => item.path === '/') : route.optimizedRoutes.

    //const matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h();
    }

    const component = (cache[name] = matched.component);

    return h(component, data, children);
  }
};
