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
          v-if="item.comments.length == 0",
          @click="toggleComment(item._id)"
        )
        i.fas.fa-comment-dots(
          v-if="item.comments.length > 0",
          @click="toggleComment(item._id)"
        )
        .menu
          i.fas.fa-ellipsis-v
          ul
            li(@click="remove(item._id)") Delete item
            li(@click="editMode($event, item)", v-if="listAdmin") Edit item
      .hide.comments(:ref="item._id")
        item-comment(
          v-if="item.comments.length > 0",
          :listId="listId",
          :itemId="item._id"
        )
  div(v-else) You don't have any item yet
</template>
<!--template>







  <div id="item-grid">
    <div v-if="items && items.length > 0">
      <div v-for="item in items" :id="item._id" :key="item._id">
        <form
          @submit.prevent="saveInput(item)"
          class="row"
          :class="[
            item._id == idEdit ? 'focus' : '',
            item.done ? 'done' : '',
            item.updatedAt > lastSeen[listId] ? 'xxxyellow' : '',
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
          <div class="buttons">
            <div v-if="!editListItems" class="normal">
              <i
                v-if="item.comments.length == 0"
                @click="toggleComment(item._id)"
                class="far fa-comment-dots"
              ></i>
              <i
                v-if="item.comments.length > 0"
                @click="toggleComment(item._id)"
                class="fas fa-comment-dots"
              ></i>
            </div>
            <div v-if="editListItems" class="special">
              <i @click="remove(item._id)" class="fas fa-trash-alt"></i>
              <i @click="editMode($event, item)" class="fas fa-edit"></i>
            </div>
          </div>
        </form>
        <div :ref="item._id" class="hide comments">
          <item-comment
            v-if="item.comments.length > 0"
            :listId="listId"
            :itemId="item._id"
          ></item-comment>
        </div>
      </div>
    </div>
    <div v-else>You don't have any item yet</div>
  </div>
</template-->

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
