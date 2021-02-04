<template>
  <div id="items">
    <div v-if="items && items.length > 0">
      <form
        @submit.prevent
        class="item-row"
        v-for="item in items"
        :id="item._id"
        :key="item._id"
        :class="[
          item.done ? 'done' : '',
          item.updatedAt > lastSeen[listId] ? 'yellow' : '',
        ]"
      >
        <div class="avatar">
          <i class="fas fa-check"></i>
        </div>
        <div class="item-title">
          <input v-if="idEdit == item._id" type="text" v-model="item.title" />
          <span v-if="idEdit != item._id">
            {{ item.title }}
          </span>
        </div>
        <div class="buttons">
          <i
            v-if="idEdit != item._id"
            @click="remove(item._id)"
            class="fas fa-trash-alt"
          ></i>

          <i
            v-if="idEdit != item._id"
            @click="idEdit = item._id"
            class="fas fa-edit"
          ></i>
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

<script src="./item-grid.js"></script>
<style>
#items {
  overflow: auto;
  height: calc(100vh - 130px);
  background: repeating-linear-gradient(
    45deg,
    #ececec,
    #ececec 5px,
    #efefef 5px,
    #efefef 10px
  );
}
@media (min-width: 1300px) {
  #items {
    height: calc(100vh - 170px);
  }
}
#items::-webkit-scrollbar {
  width: 6px;
}
#items::-webkit-scrollbar-track {
  background: #e0e0e0;
}
#items::-webkit-scrollbar-thumb {
  background: #c0c0c0;
}

@keyframes yellow {
  0% {
    background: #ecedad;
  }
  50% {
    background: #ecedad;
  }
  100% {
    background: white;
  }
}
.yellow {
  animation: yellow 2s;
}
#items .item-row.done .avatar {
  background-color: green;
}
#items .item-row.done {
  opacity: 0.9;
  cursor: default;
}
#items .item-row {
  margin: 5px;
  background-color: white;
  display: flex;
  position: relative;
  border-bottom: 1px solid #f2f2f2;
  line-height: 49px;
  cursor: pointer;
  color: #000;
}
#items .item-row:active {
  background: #ebebeb;
}
#items .item-row:hover {
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
.item-title span {
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  font-size: 1.3em;
  padding-left: 0.7em;
}

.item-row .buttons {
  color: #ababab;
  padding-left: 3px;
  padding-right: 3px;
}
</style>
