<template>
<form>
		<input type="text" v-model="email" placeholder="email" /><br />
		<input type="text" v-model="password" placeholder="password" /><br />
		<button type="submit" @click=submit>sumbit</button>
</form>
</template>
<script>
import axios from 'axios';

export default {
  data: () => ({
    email: '',
    password: ''
  }),
  methods: {
    async submit() {
      return axios({
        method: 'post',
        data: {
          email: this.email,
          password: this.password,
        },
        url: 'http://10.0.0.199:8082/users/login',
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
alert( "ERROR" );
          //const message = error.response.data.message;
          //this.$swal('Oh oo!', `${message}`, 'error');
          //this.$router.push({ name: 'Login' });
        });
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
