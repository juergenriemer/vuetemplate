<template>
  <div id="lists">
    <form @submit.prevent>
      <div v-if="lists && lists.length > 0">
        <div
          class="list-row"
          v-for="list in lists"
          :id="list._id"
          :key="list._id"
          :class="list._id == listId ? 'current' : ''"
        >
          <span v-if="list.meta">(({{ list.meta.updated }})</span>
          <div class="avatar">
            <router-link class="" :to="`/main/${list._id}`"> AB </router-link>
          </div>
          <div class="list-title">
            <input v-if="idEdit == list._id" type="text" v-model="list.title" />
            <span v-if="idEdit != list._id">
              <router-link class="" :to="`/main/${list._id}`">
                {{ list.title }}
              </router-link>
            </span>
          </div>
          <div class="buttons">
            <button v-if="idEdit != list._id" @click="remove(list._id)">
              X
            </button>
            <button v-if="idEdit != list._id" @click="idEdit = list._id">
              E
            </button>
            <button v-if="idEdit == list._id" @click="edit(list)" type="submit">
              S
            </button>
          </div>
        </div>
      </div>
      <div v-else>You don't have any list yet</div>
    </form>
  </div>
</template>

<script src="./script.js"></script>
<style>
.list-row.current {
  background: #ebebeb;
}
.list-row {
  display: flex;
  position: relative;
  border-bottom: 1px solid #f2f2f2;
  line-height: 49px;
  cursor: pointer;
  color: #000;
}
.list-row:active {
  background: #ebebeb;
}
.list-row:hover {
  background: #f5f5f5;
}
.list-row a {
  text-decoration: none;
}
.list-row a:active,
.list-row a:visited {
  color: #000;
}
.list-row .avatar {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin: 3px;
}

.list-title {
  position: relative;
  margin-right: auto;
  flex-basis: 20px;
  flex-grow: 1;
}
.list-title a {
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  font-size: 17px;
}

.list-row .buttons {
  color: #ababab;
  padding-left: 3px;
  padding-right: 3px;
}
</style>
<link rel="stylesheet" href="./styles.css">
