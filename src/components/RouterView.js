export default {
  name: "RouterView",
  functional: true,
  render(_, { props, children, parent, data }) {
    const h = parent.$createElement;

    console.log("render start");

    data.routerView = true;

    //const h = parent.$createElement;
    const name = props.name;
    const route = parent.$route;
    const cache = parent._routerViewCache || (parent._routerViewCache = {});

    /*
    if (route.hasOwnProperty("isBackNavigation") && route.isBackNavigation) {
      console.log("isBackNavigation:", route.isBackNavigation);
      return h("Frame", {}, []);
    }
     */

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
    console.log("depth", depth);

    let optimizedRoute = parent.$router.optimizedRoutes.find(
      item => item.path === route.path
    );

    console.log("optimized route");

    if (!optimizedRoute) {
      if (route.component) {
        optimizedRoute = route;
      } else {
        return h();
      }
    }

    const pathArray = optimizedRoute.path.split("/").filter(Boolean);
    console.log("pathArray");
    console.log(pathArray);

    let depthPath = "/";

    for (let i = 0; i <= depth; i++) {
      if (pathArray[i]) {
        depthPath += pathArray[i];
      }
      depthPath += "/";
    }
    if (depth === 0) {
      depthPath = depthPath.slice(0, -1);
    }

    console.log(depthPath);

    let matched;

    if (!pathArray.length) {
      matched = optimizedRoute;
    } else {
      matched = parent.$router.optimizedRoutes.find(
        item => item.path === depthPath
      );
    }

    //const matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h();
    }
    console.log("Rendered: " + matched.component.name); //eslint-disable-line

    const component = (cache[name] = matched.component);
    return h(component, data, children);

    //return h("Frame", {}, [h(component, data, children)]);
  }
};
