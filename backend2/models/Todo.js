const mongoose = require("mongoose");

const TodoItemSchema = new mongoose.Schema(
  {
    title: {
      type: "String",
      required: true,
      display: "Todo",
      minlength: 3,
      maxlength: 20,
    },
    done: {
      type: "Boolean",
      display: "done!",
    },
  },
  { timestamps: true }
);
mongoose.model("TodoItem", TodoItemSchema);
