<template>
  <component :is="routeComponent" />
</template>

<script>
export default {
  name: "RouterView",
  data() {
    return {
      routeComponent: null
    };
  },
  props: {
    defaultRoute: {
      type: String,
      default: "/"
    }
  },
  created() {
    const matchedRoute = this.$router.routeMatcher(this.defaultRoute);
    this.routeComponent = matchedRoute ? matchedRoute.component : null;
  }
};
</script>
