import TodoItem from "@/services/TodoItemsService";
import { mapActions } from "vuex";

export default {
  name: "TodoItemAdd",
  data() {
    return {
      model: { title: "", done: false }
    };
  },
  methods: {
    ...mapActions(["addTodo"]),
    add() {
      this.addTodo(this.model);
      this.model.title = "";
    }
  }
};
