<template>
  <div class="posts">
    <h1>Edit Post</h1>
      <div class="form">
        <div>
          <input type="text" name="title" placeholder="TITLE" v-model="title">
        </div>
        <div>
          prio <input type="checkbox" name="prio" placeholder="PRIO" v-model="prio">
        </div>
        <div>
          <button class="app_post_btn" @click="update">Update</button>
        </div>
      </div>
  </div>
</template>

<script>
import Todo from '@/services/TodosService'
export default {
  name: 'TodoEdit',
  data () {
    return {
      model : Todo.empty()
    }
  },
  mounted () {
    this.get()
  },
  methods: {
    async get() {
        let id = this.$route.params.id
      const response = await Todo.read(id );
      this.title = response.data.item.title;
      this.prio = response.data.item.prio;
    },
    async update() {
      await Todo.update({
        id: this.$route.params.id,
        title: this.title,
        prio: this.prio
      })
      this.$router.push({ name: 'TodoIndex' })
    }
  }
}
</script>
<style type="text/css">
.form input, .form textarea {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.form div {
  margin: 20px;
}
.app_post_btn {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 520px;
  border: none;
  cursor: pointer;
}
</style>
