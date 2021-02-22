const valid = {
  firstName(input) {
    return input && input.length > 1 ? "" : "firstName";
  },
  lastName(input) {
    return input && input.length > 1 ? "" : "lastName";
  },
  email(input) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) ? "" : "email";
  },
  password(input) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})/.test(
      input
    )
      ? ""
      : "password";
  },
};
module.exports = valid;
