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
          <input type="number" name="year" placeholder="YEAR" v-model="year">
        </div>
        <div>
          <textarea rows="5" cols="15" placeholder="DESCRIPTION" v-model="description"></textarea>
        </div>
        <div>
          <button class="app_post_btn" @click="updatePost">Update</button>
        </div>
      </div>
  </div>
</template>

<script>
import Post from '@/services/PostsService'
import myMixin from '@/mixins/Filter'
export default {
mixins: [myMixin],
  name: 'EditPost',
  data () {
    return {
      title: '',
      year : '',
      prio : '',
      description: ''
    }
  },
  mounted () {
    this.getPost()
  },
  methods: {
    async getPost () {
        let id = this.$route.params.id
      const response = await Post.read(id );
      console.log( response )
      this.title = response.data.item.title
      this.description = response.data.item.description
    },
    async updatePost () {
      await Post.update({
        id: this.$route.params.id,
        title: this.title,
        description: this.description
      })
      this.$router.push({ name: 'Posts' })
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
