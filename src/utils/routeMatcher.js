import Regexp from "path-to-regexp";

export function routeMatch(optimizedRoutes, path) {
//  console.log(optimizedRoutes);

  for (const optimizedRoute of optimizedRoutes) {
    let keys = [];
    const regexp = Regexp(optimizedRoute.path, keys);
    const regexpResult = regexp.exec(path);
    if (regexpResult) {
      console.log(regexp);
      console.log(keys);
      console.log(regexpResult);

      // has params
      if (regexpResult.length > 1) {
      }
    }
  }
  return null;
}
