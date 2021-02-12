<template>
  <div class="row" id="user">
    <div class="left column">
      <div id="Register">
        <h3>Register an account</h3>
        <form
          class="form"
          novalidate
          v-if="status != 'OK'"
          @submit.prevent="validate"
        >
          <div :class="valid('firstName')">
            <label for="firstName">First Name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              v-model="user.firstName"
              :disabled="sending"
            />
          </div>
          <div :class="valid('lastName')">
            <label for="lastName">Last Name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              v-model="user.lastName"
              :disabled="sending"
            />
          </div>
          <div :class="valid('email')">
            <label for="email">E-Mail</label>
            <input
              type="email"
              name="email"
              id="email"
              v-model="user.email"
              :disabled="sending"
            />
          </div>
          <div :class="valid('password')">
            <label for="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              v-model="user.password"
              :disabled="sending"
            />
          </div>
          <div>
            <button type="submit" :disabled="sending">REGISTER</button>
          </div>
          <p v-if="status == 'idle'"></p>
          <p v-if="sending">Contacting server...</p>
          <p v-if="status == 'error'">
            An error happend.<br />
            Please try again later.
          </p>
        </form>
        <p v-if="status == 'OK'">
          Your registration was successful.<br />
          Please check your mailbox for a verification e-mail.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data: () => ({
    status: "idle",
    user: {
      firstName: "Juergen",
      lastName: "Riemer",
      email: "juergen.riemer@gmail.com",
      password: "test",
    },
    userSaved: false,
    lastUser: null,
  }),
  validations: {
    form: {
      firstName: {
        required: true,
        minLength: 3,
      },
    },
  },
  computed: {
    sending() {
      return this.status == "sending";
    },
  },
  methods: {
    ...mapActions(["registerUser"]),
    valid(fieldName) {
      return {
        invalid: 1 == 2,
      };
    },
    async register() {
      this.status = "sending";
      console.log(this.user);
      const res = await this.registerUser(this.user);
      setTimeout(() => {
        this.status = "OK";
      }, 666);
    },
    clear() {
      this.user.firstName = "";
    },
    validate() {
      this.register();
    },
  },
};
</script>
