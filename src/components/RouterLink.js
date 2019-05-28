export default {
  name: "RouterLink",
  functional: true,
  props: {
    to: {
      type: [String, Object],
      required: true
    }
  },
  render(_, { props, parent, children }) {
    const h = parent.$createElement;

    return h(
      "Label",
      {
        on: {
          tap: () => {
            console.log("tapped1");
            parent.$router.push(props.to);
          }
        },
        style: {
          color: "blue",
          fontSize: "15"
        }
      },
      children
    );
  }
};
