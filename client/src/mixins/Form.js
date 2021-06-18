export default {
  data: () => ({
    errors: {},
    status: "idle",
    sending: false,
    nodes: null,
    fields: null,
  }),
  computed: {
    disabled() {
      return this.sending == true;
    },
  },
  watch: {
    $route(to, from) {
      this.formFocus();
    },
  },
  updated() {
    this.formFocus();
  },
  mounted() {
    this.formFocus();
  },
  methods: {
    getFields() {
      if (this.fields) return this.fields;
      this.fields = {};
      this.$refs.form.querySelectorAll(`[name]`).forEach((node) => {
        let rules = node.closest("[rules]")
          ? node
              .closest("[rules]")
              .getAttribute("rules")
              .split(",")
          : null;
        this.fields[node.name] = {
          node,
          rules,
        };
      });
      return this.fields;
    },
    isValid() {
      let valid = true;
      this.errors = [];
      let fields = this.getFields();
      for (let name in fields) {
        let field = fields[name];
        if (field.rules) {
          field.rules.forEach((rule) => {
            if (!this.errors[name]) {
              let val = field.node.value;
              let result = this.validationRule(rule, val);
              if (result !== true) {
                this.errors[name] = result;
                valid = false;
              }
            } else valid = false;
          });
        }
      }
      return valid;
    },
    getFormData() {
      let data = {};
      let fields = this.getFields();
      for (let name in fields) {
        data[name] = fields[name].node.value;
      }
      return data;
    },
    validate() {
      if (this.isValid() && !this.sending) {
        this.sending = true;
        setTimeout(() => {
          this.form = this.getFormData();
          const submit = this.submit();
          if (submit && submit.finally)
            submit.finally(() => {
              this.sending = false;
            });
        }, 0);
      }
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
    resetForm() {
      this.$refs.form.reset();
    },
    formFocus() {
      const form = this.$refs.form;
      const focus = () => {
        const field = form.querySelector(`[hasFocus] input`);
        field && field.focus();
      };
      this.$nextTick(() => {
        focus();
      });
      //form && setTimeout(focus, 99);
      // second one because ionic blurs my item edit focus.. need to check
      //form && setTimeout(focus, 999);
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
