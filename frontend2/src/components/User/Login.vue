<template>
  <form @submit.prevent>
    <h3>Login</h3>
    <input type="text" v-model="email" placeholder="email" /><br />
    <input type="text" v-model="password" placeholder="password" /><br />
    <button type="submit" @click="submit">sumbit</button>
    <hr />
    <router-link to="/register">Register new account</router-link>
  </form>
</template>
<script>
//import axios from 'axios';

import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    email: "juergen.riemer@gmail.com",
    password: "test",
  }),

  computed: mapGetters(["user"]),
  methods: {
    ...mapActions(["login"]),
    async submit() {
      const info = {
        email: this.email,
        password: this.password,
      };
      let res = await this.login(info);
      if (res && res.data && res.data.success) {
        let hash = self.location.hash;
        let parts = hash.split("ogin#next=");
        console.log(parts);
        if (parts && parts[1]) {
          self.location.href = parts[1];
        } else {
          this.$router.push("/");
        }
      }
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
