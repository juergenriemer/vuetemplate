<template>
  <div>
    <form @submit.prevent>
      <input type="text" v-model="user.username" placeholder="username" /><br />
      <input type="text" v-model="user.email" placeholder="email" /><br />
      <input type="text" v-model="user.password" placeholder="password" /><br />
      <button type="submit" @click="submit">create</button>
    </form>
    <p v-if="status == 'idle'">Please enter your data.</p>
    <p v-if="status == 'OK'">
      Your registration was successful.<br />
      Please check your mailbox for a verification e-mail.
    </p>
    <p v-if="status == 'error'">
      An error happend.<br />
      Please try again later.
    </p>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    status: "idle",
    user: {
      username: "jriemer",
      email: "juergen.riemer@gmail.com",
      password: "test",
    },
  }),
  methods: {
    ...mapActions(["register"]),
    async submit() {
      const res = await this.register(this.user);
      console.log(res);
      this.status = "OK";
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
