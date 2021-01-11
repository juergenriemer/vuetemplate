<template>
  <div class="items">
	<h1>Todo List</h1>
    <div v-if="items.length > 0" class="table-wrap">
      <table border=1>
        <tr>
          <td>Title</td>
          <td>done</td>
        </tr>
        <tr v-for="item in items" v-bind:key="item._id">
          <td>
			<input v-if="edit.id==item._id" type="text" v-model="edit.title" />
			<span v-if="edit.id!=item._id">{{ item.title }}</span>
			</td>
		<td class="buttons">
            <!--a v-if="edit.id!=item._id" href="#" @cick="remove(item._id)">X</a-->
            <a v-if="edit.id!=item._id" href="#" @cick="done(item._id)">OK</a>
            <a v-if="edit.id!=item._id" href="#" @cick="edit(item._id)">EDIT</a>
          </td>
        </tr>
      </table>
    </div>
    <div v-else>
      There are no posts..
    </div>
  </div>
</template>

<script src="./list.js"></script>
<link rel="stylesheet" href="./styles.css">
