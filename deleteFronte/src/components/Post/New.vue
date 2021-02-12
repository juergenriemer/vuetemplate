<template>
  <div class="posts">
    <h1>Add Postssss</h1>
      <div class="form">
        <div>
          <input type="text" name="title" placeholder="TITLE" v-model="model.title">
        </div>
        <div>
          <input type="checkbox" name="prio" placeholder="PRIO" v-model="model.prio">
          priority
        </div>
        <div>
          <input type="number" name="year" placeholder="YEAR" v-model="model.year">
        </div>
        <div>
          <textarea rows="5" cols="15" placeholder="DESCRIPTION" v-model="model.description"></textarea>
        </div>
        <div>
          <button class="app_post_btn" @click="addPost">Add</button>
        </div>
      </div>

      <router-link v-bind:to="{ name: 'PostSearch' }" class="add_item_link">PostSearch</router-link>
      <router-link v-bind:to="{ name: 'xxx' }" class="add_item_link">Home</router-link>
  </div>
</template>

<script>
import Post from '@/services/PostsService'
import myMixin from '@/mixins/Filter'
export default {
mixins: [myMixin],
  name: 'PostNew',
  data () {
    return {
      model : Post.empty()
    }
  },
  methods: {
    async addPost () {
      await Post.create({...this.model} )
      this.$router.push({ name: 'PostSearch' })
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
