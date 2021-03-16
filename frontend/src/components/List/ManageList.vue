<template lang="pug">
.form
  h4 Name & Description
    w-form(novalidate, @validate="validate")
      w-input#title.mb4(
        label="TITLE",
        name="title",
        v-model="list.title",
        :disabled="sending",
        :validators="[valid.firstName]",
        required
      )
      w-textarea#description.mb4(
        label="Describe this list",
        name="description",
        v-model="list.description",
        :disabled="sending"
      )
      .buttons
        w-button.ma1(
          bg-color="primary",
          color="white",
          shadow,
          md,
          :disabled="sending",
          :loading="sending",
          type="submit"
        ) SAVE CHANGES
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { bus } from "../../main";
import Form from "@/mixins/Form";

export default {
  name: "ManageList",
  mixins: [Form],
  data() {
    return {};
  },
  created() {},
  computed: {
    ...mapGetters(["lists"]),
    list() {
      const list = this.lists.find((list) => list._id == this.listId);
      return list || {};
    },
    listId() {
      return this.$route.params.id;
    },
  },
  methods: {
    ...mapActions(["updateList"]),
    async submit() {
      console.log(this.list);
      this.updateList({
        listId: this.listId,
        list: this.list,
      }).catch((err) => this.showError(err));
    },
  },
};
</script>
