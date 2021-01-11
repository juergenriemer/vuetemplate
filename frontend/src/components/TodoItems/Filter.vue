<template>
<form @submit.prevent="submit">
    <h1>Todo Filter</h1>
    <input type="text" placeholder="TITLE" v-model="filter.query.title">
    <input type="checkbox" v-model="filter.query.prio">
    <hr />
<span v-if="filter.sort">
    <select v-model="filter.sort.field">
      <option value="_id">id</option>
      <option value="title">title</option>
    </select>
    <select v-model="filter.sort.dir">
      <option value="1">asc</option>
      <option value="-1">desc</option>
    </select>
</span>
<span v-if="filter.slice">
    <input slice type="number" v-model="filter.slice.skip">
    <input slice type="number" v-model="filter.slice.limit">
</span>
         <button type="submit">
            Search
        </button>
  </form>
</template>

<script src="./filter.js"></script>

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
[slice]{
	width:40px
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
