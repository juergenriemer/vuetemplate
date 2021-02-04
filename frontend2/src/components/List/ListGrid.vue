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
          <div class="bulb">
            <div class="badge" v-if="missedUpdates[list._id]">
              {{ missedUpdates[list._id] }}
            </div>
            <router-link class="" :to="`/main/${list._id}`">
              <div class="avatar">
                <svg
                  width="100%"
                  height="100%"
                  :data-jdenticon-value="list.title"
                ></svg>
              </div>
            </router-link>
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

<script src="./list-grid.js"></script>
<style>
#lists {
  overflow: auto;
  background: #fff;
  height: calc(100vh - 130px);
}

@media (min-width: 1300px) {
  #lists {
    height: calc(100vh - 170px);
  }
}
#lists::-webkit-scrollbar {
  width: 6px;
}
#lists::-webkit-scrollbar-track {
  background: #e0e0e0;
}
#lists::-webkit-scrollbar-thumb {
  background: #c0c0c0;
}

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
.list-row .bulb {
  position: relative;
}
.list-row .avatar {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin: 3px;
}

.list-row .badge {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  margin-top: 1px;
  margin-right: 1px;
  font-weight: bold;
  font-size: 11px;
  line-height: 16px;
  color: white;
  width: 16px;
  height: 16px;
  text-align: center;
  border-radius: 50%;
  background: red;
  border: 2px solid white;
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
