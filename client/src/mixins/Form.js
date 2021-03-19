export default {
  data: () => ({
    status: "idle",
    valid: {
      firstName: (input) => input.length > 1 || "At least two characters",
      lastName: (input) => input.length > 1 || "At least two characters",
      email: (input) => true,
      password: (input) => true,
    },
  }),
  computed: {
    sending() {
      return this.status == "sending";
    },
    active() {
      return this.status == "sending" || this.status == "idle";
    },
  },
  methods: {
    validate({ errorsCount }) {
      if (!errorsCount) this.submit();
    },
  },
};
