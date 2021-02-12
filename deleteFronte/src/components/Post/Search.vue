<template>
  <div class="items">
    <h1>Riemer Portal</h1>
    <input type="text" placeholder="TITLE" v-model="item.title">
    <input type="checkbox" v-model="item.prio">
    <input type="number" placeholder="YEAR" v-model="item.year">
    <input type="text" placeholder="DESCRIPTION" v-model="item.description">
    <hr />
    <select v-model="sort.field">
      <!-- <option v-for="{field, displayName} in meta" :value="field" :key="field">
        {{displayName}}</option> -->
    </select>
    <select v-model="sort.dir">
      <option value="1">asc</option>
      <option value="-1">desc</option>
    </select>
    <input type="number" v-model="slice.skip">
    <input type="number" v-model="slice.limit">
    <button id="search" @click="getPosts">search</button>
    <hr />
    <div v-if="items.length > 0" class="table-wrap">
      <table>
        <tr>
          <td>ID</td>
          <td>Title</td>
          <td width="550">Description</td>
          <td>Prio</td>
          <td>Year</td>
          <td width="100" align="center">Action</td>
        </tr>
        <tr v-for="item in items" v-bind:key="item._id">
          <td>{{ item._id}}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.prio}}</td>
          <td>{{ item.year}}</td>
          <td align="center">
            <router-link v-bind:to="{ name: 'PostEdit', params: { id: item._id } }">Edit</router-link> |
            <a href="#" @click="deletePost(item._id)">Delete</a>
          </td>
        </tr>
      </table>
      <router-link v-bind:to="{ name: 'PostNew' }" class="add_item_link">PostNew</router-link>
    </div>
    <div v-else>
      There are no posts.. Lets add one now <br /><br />
      <router-link v-bind:to="{ name: 'PostNew' }" class="add_item_link">PostNew</router-link>
      <router-link v-bind:to="{ name: 'xxx' }" class="add_item_link">Home</router-link>
    </div>
  </div>
</template>

<script>
import Post from '@/services/PostsService'

export default {
  name: 'PostSearch',
  data () {
    return {
      item : Post.empty()
      , items: []
      , sort : {
        field : "title" 
        , dir : 1
      } 
      , slice : {
        skip : 0
        , limit : 20
      }
    }
  },
  mounted () {
    this.getPosts()
  },
  methods: {
    async getPosts () {
      let query = {};
      let model = Post.model();
      for( let field in model ){
        let val = this.item[field];
        let type = model[ field ].type;
        if( val ){
          switch( type ) { 
            case "String" :
              query[field] = `/${val}/`;
              break;
              default:
              query[field] = val
              break;
          }
        } 
      }
      const response = await Post.list( query, this.sort, this.slice, [] );
      this.items = response.data.items;
    },
    async deletePost (id) {
      await Post.delete(id);
      this.getPosts();
      this.$router.push({ name: 'Posts' })
    }
  }
  , watch: {
      items: function() {
      }
    }
}
</script>
<style type="text/css">
.table-wrap {
  width: 60%;
  margin: 0 auto;
  text-align: center;
}
table th, table tr {
  text-align: left;
}
table thead {
  background: #f2f2f2;
}
table tr td {
  padding: 10px;
}
table tr:nth-child(odd) {
  background: #f2f2f2;
}
table tr:nth-child(1) {
  background: #4d7ef7;
  color: #fff;
}
a {
  color: #4d7ef7;
  text-decoration: none;
}
a.add_item_link {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
}
</style>
