<template>
  <form>
    <input type="text" v-model="username" placeholder="username" /><br />
    <input type="text" v-model="password" placeholder="password" /><br />
    <button type="submit" @click=submit>sumbit</button>
  </form>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    username: '',
    password: ''
  }),
  methods: {
    async submit() {

      const info = {
        username: this.username
        ,password:this.password
      }
      this.$store.dispatch('signup', info).then(
        () => this.$router.push('/login')
      );

      /*
        return axios({
          method: 'post',
          data: {
            username: this.username,
            password: this.password,
          },
          url: 'http://10.0.0.199:3000/users/register',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(() => {
            this.$router.push({ name: 'Login' });
          })
          .catch((error) => {
            const message = error.response.data.message;
            console.warn(`${message}`);
          });
      return true;
       */
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
