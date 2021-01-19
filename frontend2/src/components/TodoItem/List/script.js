import Model from "@/services/TodoItemsService";
import Filter from "@/mixins/Filter";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TodoItemList",
  mixins: [Filter],
  data() {
    return {
      filterName: "todoitem",
      filter: {
        query: {}
      },
      items: [],
      idEdit: null
    };
  },
  created() {
    this.fetch();
  },
  computed: mapGetters(["allTodos", "user"]),
  methods: {
    ...mapActions(["listTodos", "filterTodos", "deleteTodo", "updateTodo"]),
    onFilterChange() {
      this.fetch();
    },
    async fetch() {
      //      let model = Model.model();
      //      let request = this.requestFilter(model);
      let result = await this.listTodos();
      console.log(this.allTodos);
      console.log(result);
    },
    async remove(id) {
      let result = await this.deleteTodo(id);
      document.getElementById(id).style.display = "none";
      console.log("deleted");
    },
    async edit(data) {
      let result = await this.updateTodo(data);
      result && (this.idEdit = null);
    },
    async done(item) {
      item.done = !item.done;
      let result = await this.updateTodo(item);
    }
  }
};
