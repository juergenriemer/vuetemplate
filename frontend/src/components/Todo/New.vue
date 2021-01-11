<template>
  <div class="posts">
    <h1>Add Todo</h1>
      <div class="form">
        <div>
          <input type="text" name="title" placeholder="TITLE" v-model="model.title">
        </div>
        <div>
          <input type="checkbox" name="prio" placeholder="PRIO" v-model="model.prio">
          priority
        </div>
        <div>
          <button class="app_post_btn" @click="add">Add</button>
        </div>
      </div>

  </div>
</template>

<script>
import Todo from '@/services/TodosService'

export default {
  name: 'TodoNew',
  data () {
    return {
      model : Todo.empty()
    }
  },
  methods: {
    async add() {
      await Todo.create({...this.model} )
      this.$router.push({ name: 'PostIndex' })
    }
  }
}
</script>

<style type="text/css">
* {
  background: garnichts;
}
.form input, .form textarea {
  background:pink;
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
