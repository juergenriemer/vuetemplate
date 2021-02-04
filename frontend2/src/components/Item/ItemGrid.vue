<template>
  <div id="items">
    <div v-if="items && items.length > 0">
      <form
        @submit.prevent="submit(item)"
        @dblclick="done(item)"
        class="item-row"
        v-for="item in items"
        :id="item._id"
        :key="item._id"
        :class="[
          item._id == idEdit ? 'focus' : '',
          item.done ? 'done' : '',
          item.updatedAt > lastSeen[listId] ? 'yellow' : '',
        ]"
      >
        <div class="avatar">
          <i class="fas fa-check" @click="done(item)"></i>
        </div>
        <div class="item-title">
          <input
            v-if="idEdit == item._id"
            @blur="idEdit = null"
            type="text"
            v-model="item.title"
          />
          <span class="noselect" v-if="idEdit != item._id">
            {{ item.title }}
          </span>
        </div>
        <div class="buttons">
          <i @click="remove(item._id)" class="fas fa-trash-alt"></i>
          <i @click="editMode($event, item)" class="fas fa-edit"></i>
        </div>
      </form>
    </div>
    <div class="onboard" v-else>You don't have any item yet</div>
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
  color: white;
}
#items .item-row.done {
  opacity: 0.9;
  xcursor: default;
}
#items .item-row.done .item-title span {
  text-decoration: line-through;
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

#items .item-row.focus:hover {
  background: #fff;
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

.item-row input {
}
.item-row .buttons {
  padding-top: 4px;
  padding-right: 4px;
}
.item-row .buttons i {
  color: #777;
  font-size: 1.3em;
  padding: 5px;
}
.item-row .buttons i:hover {
  color: #000;
}

.item-title span {
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.item-title span,
.item-title input {
  /* needed to set for input as well.. put in app.vue */
  font-family: Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu,
    Cantarell, Fira Sans, sans-serif;
  font-size: 1.3em;
  padding-left: 0.7em;
}

#items input:focus {
  outline: none;
}
#items input {
  margin: 0;
  border: 0;
  background: #fff;
  margin-top: 11px;
}
.onboard {
  font-size: 2em;
  padding: 3em;
}
</style>
