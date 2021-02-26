<template>
  <div id="item-grid" v-if="showItemGrid">
    <div v-if="items && items.length > 0">
      <form
        @submit.prevent="saveInput(item)"
        @dblclick="done(item)"
        class="row"
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
        <div class="title" v-if="idEdit == item._id">
          <input
            @blur="closeInput()"
            @keydown="
              if ($event.key == 'Escape') {
                closeInput();
              }
            "
            spellcheck="false"
            type="text"
            v-model="newTitle"
          />
        </div>
        <div
          v-if="idEdit != item._id"
          class="title noselect"
          :title="item.title"
        >
          {{ item.title }}
        </div>
        <div v-if="editListItems" class="buttons">
          <div class="special">
            <i @click="remove(item._id)" class="fas fa-trash-alt"></i>
            <i @click="editMode($event, item)" class="fas fa-edit"></i>
          </div>
        </div>
      </form>
    </div>
    <div v-else>You don't have any item yet</div>
  </div>
</template>

<script src="./item-grid.js"></script>
<style>
.row input {
  width: 100%;
  border: 0;
  background: #fff;
}
.row.focus {
  background: whitesmoke;
}
.row.focus input {
  background: whitesmoke;
}

.row.done {
  opacity: 0.7;
}
.row .avatar {
  background: #c0c0c0;
  color: #000;
}
.row.done .avatar {
  background: green;
  color: white;
}
.row.done .title {
  text-decoration: line-through;
}
</style>
