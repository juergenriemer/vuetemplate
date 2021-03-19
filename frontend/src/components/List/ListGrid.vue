<template>
  <div id="list-grid">
    <form @submit.prevent>
      <div v-if="lists && lists.length > 0">
        <div
          class="row"
          v-for="list in lists"
          :id="list._id"
          :key="list._id"
          :class="list._id == listId ? 'current' : ''"
          @click="to(list._id)"
        >
          <div class="avatar">
            <svg
              width="100%"
              height="100%"
              :data-jdenticon-value="list.title"
            ></svg>
          </div>

          <div class="title">
            {{ list.title }}
          </div>
          <div class="badge" v-if="missedUpdates[list._id]">
            {{ missedUpdates[list._id] }}
          </div>
        </div>
      </div>
      <div v-else>You don't have <br />any list yet</div>
    </form>
  </div>
</template>

<script src="./list-grid.js"></script>
