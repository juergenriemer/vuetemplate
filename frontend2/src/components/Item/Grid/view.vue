<template>
  <div id="items">
    <div v-if="items && items.length > 0">
      <form
        @submit.prevent
        class="item-row"
        v-for="item in items"
        :id="item._id"
        :key="item._id"
        :class="item.done ? 'done' : ''"
      >
        <span v-if="new Date(item.updatedAt) > new Date(lastSeen)">NEW</span>
        <div class="avatar">AB</div>
        <div class="item-title">
          <input v-if="idEdit == item._id" type="text" v-model="item.title" />
          <span v-if="idEdit != item._id">
            {{ item.title }}
          </span>
        </div>
        <div class="buttons">
          <button v-if="idEdit != item._id" @click="remove(item._id)">X</button>
          <button v-if="idEdit != item._id" @click="idEdit = item._id">
            E
          </button>
          <button v-if="idEdit != item._id" @click="done(item)">OK</button>
          <button v-if="idEdit == item._id" @click="edit(item)" type="submit">
            S
          </button>
        </div>
      </form>
    </div>
    <div v-else>You don't have any item yet</div>
  </div>
</template>

<script src="./script.js"></script>
<style>
.item-row.done {
  opacity: 0.5;
  cursor: default;
}
.item-row {
  display: flex;
  position: relative;
  border-bottom: 1px solid #f2f2f2;
  line-height: 49px;
  cursor: pointer;
  color: #000;
}
.item-row:active {
  background: #ebebeb;
}
.item-row:hover {
  background: #f5f5f5;
}
.item-row a {
  text-decoration: none;
}
.item-row a:active,
.item-row a:visited {
  color: #000;
}
.item-row .avatar {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin: 3px;
}

.item-title {
  position: relative;
  margin-right: auto;
  flex-basis: 20px;
  flex-grow: 1;
}
.item-title a {
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  font-size: 17px;
}

.item-row .buttons {
  color: #ababab;
  padding-left: 3px;
  padding-right: 3px;
}
</style>
<style>
</style>
<link rel="stylesheet" href="./styles.css">
