export default {
  data: () => ({
    status: "idle",
    valid: {
      firstName: input => input.length > 1 || "At least two characters",
      lastName: input => input.length > 1 || "At least two characters",
      email: input =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) || "Enter a valid e-mail",
      password: input =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})/.test(
          input
        ) ||
        "use 8 to 32 characters, at least one number, upper, lowercase and special character"
    }
  }),
  computed: {
    sending() {
      return this.status == "sending";
    },
    active() {
      return this.status == "sending" || this.status == "idle";
    }
  },
  methods: {
    validate({ errorsCount }) {
      if (!errorsCount) this.submit();
    }
  }
};
