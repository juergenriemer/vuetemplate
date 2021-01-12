<template>
  <div class="items">
	<h1>Todo List</h1>
    <div v-if="items.length > 0" class="table-wrap">
      <table>
        <tr>
          <td>Title</td>
          <td>Prio</td>
        </tr>
        <tr v-for="item in items" v-bind:key="item._id">
          <td>{{ item.title }}</td>
          <td>{{ item.description }}</td>
          <td align="center">
            <router-link v-bind:to="{ name: 'TodoEdit', params: { id: item._id } }">Edit</router-link> |
            <a href="#" @click="remove(item._id)">Delete</a>
          </td>
        </tr>
      </table>
      <router-link v-bind:to="{ name: 'TodoNew' }" class="add_item_link">TodoNew</router-link>
    </div>
    <div v-else>
      There are no posts.. Lets add one now <br /><br />
      <router-link v-bind:to="{ name: 'TodoNew' }" class="add_item_link">TodoNew</router-link>
    </div>
  </div>
</template>

<script src="./list.js"></script>

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
