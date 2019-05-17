<script>
export default {
  name: "RouterView",
  functional: true,
  render(_, { props, children, parent, data }) {
    console.log(this.$vxpCurrentRoute);

    const h = parent.$createElement;
    const name = props.name;
    const route = parent.$route;
    const cache = parent._routerViewCache || (parent._routerViewCache = {});

    let component = this.$vxpCurrentRoute.component;

    component = props.comp;

    return h(component, data, children);
  }
};
</script>
