<template>
<form>
<input type="text" v-model="name" placeholder="name" /><br />
<input type="text" v-model="email" placeholder="email" /><br />
<input type="text" v-model="password" placeholder="password" /><br />
<button type="submit" @click=submit>sumbit</button>
</form>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    name: '',
    email: '',
    password: ''
  }),
  methods: {
    async submit() {
        return axios({
          method: 'post',
          data: {
            name: this.name,
            email: this.email,
            password: this.password,
          },
          url: 'http://10.0.0.199:8082/users/register',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(() => {
alert( 'OK' );
            this.$router.push({ name: 'Login' });
          })
          .catch((error) => {
            const message = error.response.data.message;
            console.log(`${message}`);
          });
      return true;
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
