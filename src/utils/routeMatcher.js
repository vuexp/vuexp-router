import Regexp from "path-to-regexp";

export function routeMatch(optimizedRoutes, path) {
  let i = 0;
  for (const optimizedRoute of optimizedRoutes) {
    i++;
    let keys = [];
    const regexp = Regexp(optimizedRoute.path, keys, { strict: true });
    const regexpResult = regexp.exec(path);

    if (regexpResult) {
      console.log("optimizedRoute.path");
      console.log(optimizedRoute.path, path);
      let params = Object.create({});

      keys.forEach((key, i) => {
        params[key.name] = regexpResult[i + 1];
      });

      return {
        optimizedRoute: optimizedRoute,
        path: optimizedRoute.path,
        params: params
      };
    }
  }
  return null;
}
