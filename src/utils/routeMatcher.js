import Regexp from "path-to-regexp";

export function routeMatcher(optimizedRoutes, path, depth) {
  let i = 0;
  for (const optimizedRoute of optimizedRoutes) {
    i++;
    let keys = [];
    const regexp = Regexp(optimizedRoute.path, keys, { strict: true });
    const regexpResult = regexp.exec(path);

    let pathWithoutParams = optimizedRoute.path;

    // optimizedRoute.path  -> /parent/:id
    // path                 -> /parent/5

    if (regexpResult) {
      let params = Object.create({});

      keys.forEach((key, i) => {
        params[key.name] = regexpResult[i + 1];
        pathWithoutParams = pathWithoutParams.replace("/:" + key.name, "");
      });

      const pathLength =
        path !== "/" ? pathWithoutParams.split("/").filter(Boolean).length : 1;

      // find component by depth
      // /parent/qux/5/quux -> depth = 1 -> component: Parent
      // /parent/qux/5/quux -> depth = 2 -> component: Qux
      // /parent/qux/5/quux -> depth = 3 -> component: Quux

      let route = optimizedRoute;
      for (let k = depth; k < pathLength; k++) {
        route = route.parent;
      }

      if (path !== "/" && depth > pathLength) {
        return null;
      }

      return {
        optimizedRoute: route,
        path: optimizedRoute.path,
        params,
        pathWithoutParams
      };
    }
  }
  return null;
}
