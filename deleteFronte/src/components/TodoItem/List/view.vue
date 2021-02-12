<template>
  <div class="allTodos">
    <div v-if="allTodos && allTodos.length > 0" class="table-wrap">
      <form @submit.prevent>
      <table border=1>
        <tr>
          <td>ID</td>
          <td>Title</td>
          <td></td>
        </tr>
        <tr v-for="item in allTodos" 
				:key="item._id"
				:class="item.done?'done':''"
		>
		<td>{{item.done}}</td>
          <td class="titles">
			<input v-if="idEdit==item._id" type="text" v-model="item.title" />
			<span v-if="idEdit!=item._id">{{ item.title }}</span>
			</td>
				<td class="buttons">
						<button v-if="idEdit!=item._id" @click="remove(item._id)">X</button>
						<button v-if="idEdit!=item._id" @click="done(item)">OK</button>
						<button v-if="idEdit!=item._id" @click="idEdit=item._id">EDIT</button>
						<button v-if="idEdit==item._id" @click="edit(item)" type="submit">SAVE</button>
				</td>
        </tr>
      </table>
          
      </form>
    </div>
    <div v-else>
      There are no posts..
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style>
.done td {
	background: lightgreen !important;
	opacity : 0.5;
}
td.titles {
	width: 400px;
}
</style>
<link rel="stylesheet" href="./styles.css">
