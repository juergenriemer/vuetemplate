<template>
  <form @submit.prevent>
    <input
      type="text"
      name="title"
      placeholder="ADD ITEM"
      v-model="model.title"
    />
    <button type="submit" @click="add">Add</button>
  </form>
</template>

<script src="./script.js"></script>
<link rel="stylesheet" href="./styles.css">
