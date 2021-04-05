export default {
  data: () => ({
    errors: {},
    status: "idle",
  }),
  computed: {
    disabled() {
      return this.status == "submitting";
    },
    submitting() {
      return this.status == "submitting";
    },
    active() {
      return this.status == "sending" || this.status == "idle";
    },
  },
  methods: {
    isValid() {
      let valid = true;
      for (let field in this.form) {
        const val = this.form[field];
        let node = this.$el.querySelector(`[name='${field}']`);
        let rules = node ? node.closest("[rules]") : null;
        if (node && rules) {
          this.errors[field] = "";
          rules
            .getAttribute("rules")
            .split(",")
            .forEach((rule) => {
              if (!this.errors[field]) {
                let result = this.validationRule(rule, val);
                console.log(field, rule, result);
                if (result !== true) {
                  this.errors[field] = result;
                  valid = false;
                }
              }
            });
        }
      }
      return valid;
    },
    validate() {
      if (this.isValid()) this.submit();
    },
    validationRule(rule, val, add) {
      if (/^equal:/.test(rule)) {
        var name = rule.split(":")[1];
        var other = this.$el.querySelector(`[name='${name}']`).value;
        rule = "equal";
      }
      switch (rule) {
        case "email":
          return (
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "This is no valid e-mail"
          );
          break;
        case "password":
          return true;
          break;
        case "required":
          return val.trim().length > 0 || "This field is required";
          break;
        case "test":
          return /x/.test(val) || "x felt";
          break;
        case "equal":
          return (
            other == val || "Does not match with your " + name.toUpperCase()
          );
          break;
      }
    },
  },
  /*
      required: (input) => input.trim().length > 0 || "This field is required",
      email: (input) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) || "This is no valid e-mail",
      password: (input) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})/.test(
          input
        ) ||
        "use 8 to 32 characters, at least one number, upper, lowercase and special character",
    },
*/
};
