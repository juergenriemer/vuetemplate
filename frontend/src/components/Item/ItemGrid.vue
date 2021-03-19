<template lang="pug">
#item-grid
  div(v-if="items && items.length > 0")
    div(v-for="item in items", :id="item._id", :key="item._id")
      form.row(
        @submit.prevent="saveInput(item)",
        :class="[item._id == idEdit ? 'focus' : '', item.done ? 'done' : '', item.updatedAt > lastSeen[listId] ? 'xxxyellow' : '']"
      )
        .avatar
          i.fas.fa-check(@click="done(item)")
        .title(v-if="idEdit == item._id")
          input(
            @blur="closeInput()",
            spellcheck="false",
            type="text",
            v-model="newTitle"
          )
        .title.noselect(v-if="idEdit != item._id", :title="item.title") {{ item.title }}
        i.far.fa-comment-dots(
          v-if="!isLocal && item.comments.length == 0",
          @click="toggleComment(item._id)"
        )
        i.fas.fa-comment-dots(
          v-if="!isLocal && item.comments.length > 0",
          @click="toggleComment(item._id)"
        )
        .menu
          i.fas.fa-ellipsis-v
          ul
            li(@click="remove(item._id)") Delete item
            li(@click="editMode($event, item)", v-if="isAdmin") Edit item
      .hide.comments(:ref="item._id")
        item-comment(
          v-if="item.comments.length > 0",
          :listId="listId",
          :itemId="item._id"
        )
  div(v-else) You don't have any item yet
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
