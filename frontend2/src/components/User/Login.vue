<template>
  <form @submit.prevent>
    <h3>Login</h3>
    <input type="text" v-model="username" placeholder="username" /><br />
    <input type="text" v-model="password" placeholder="password" /><br />
    <button type="submit" @click="submit">sumbit</button>
  </form>
</template>
<script>
//import axios from 'axios';

import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    username: "dmiep",
    password: "test",
  }),

  computed: mapGetters(["user"]),
  methods: {
    ...mapActions(["login"]),
    async submit() {
      const info = {
        username: this.username,
        password: this.password,
      };
      let res = await this.login(info);
      console.warn(res);
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
      /*
      $store.dispatch('login', info).then(
        () => this.$router.push('/')
      );

         */

      /*

      return axios({
        method: 'post',
        data: {
          username: this.username,
          password: this.password,
        },
        url: 'http://10.0.0.199:3000/users/login',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          window.localStorage.setItem('auth', response.data.token);
alert( "OK" );
// this.$swal('Great!', 'You are ready to start!', 'success');
          this.$router.push({ name: '/' });
        })
        .catch((error) => {
console.warn( "ERROR" );
console.log( error )
        });
       */
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
