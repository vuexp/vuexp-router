<template>
  <Frame>
    <component v-bind:is="dynamicRouteComponent"></component>
  </Frame>
</template>

<script>
export default {
  name: "vuexp-router",
  computed: {
    dynamicRouteComponent() {
      if (
        this.$vxpCurrentRoute.hasOwnProperty("component") &&
        typeof this.$vxpCurrentRoute.component !== "undefined"
      ) {
        return this.$vxpCurrentRoute.component;
      } else {
        return undefined;
      }
    }
  }
};
</script>

<style scoped></style>
