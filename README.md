# VueXP Router

Official router for VueXP, which uses same API as Vue-Router but works on all platforms.


## Remaining (In-Progress) Items (For Native)
- Nested (child) route
- Route with parameter
- Named routes
- Transition
- Route Meta Fields
- Redirect and Alias
- Navigation hooks

## Quick Start

```shell
$ npm install --save vuexp-router
```

```js
// main.js
+ import router from "./router.js";

new Vue({
+   router,
-   render: h => h('frame', App),
+   render: h => h("frame", [h("router-view")]),
}).$mount('#app');
```

```js
// main.native.js
+ import router from "./router.js";

new Vue({
+   router,
-   render: h => h('frame', App),
+   render: h => h("frame", [h("router-view")]),
}).$start()
```

```js
// router.js
import Router from "vuexp-router";
import Vue from "./vue";
import HelloWorld from "./components/HelloWorld.vue";
import AnotherPage from "./components/AnotherPage.vue";

Vue.use(Router);

export const options = {
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: HelloWorld
    },
    {
      path: "/another",
      name: "another",
      component: AnotherPage
    }
  ]
};
export default new Router(options);
```

## Routing

This package provides 2 methods for navigation, `$router.push` and `$router.back`

### \$router.push

```js
this.$router.push("/another");
```

### \$router.back

```js
this.$router.back();
```
