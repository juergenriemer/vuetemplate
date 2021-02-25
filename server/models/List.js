const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    title: {
      type: "String",
      required: true,
      minlength: 1,
      maxlength: 150,
    },
    done: {
      type: "Boolean",
      default: false,
    },
  },
  { timestamps: true }
);

const ListSchema = new mongoose.Schema(
  {
    title: {
      type: "String",
      required: true,
      minlength: 1,
      maxlength: 150,
    },
    items: [ItemSchema],
    users: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        name: String,
        short: String,
        lastSeen: Date,
        role: String,
      },
    ],
    invitees: [
      {
        email: String,
        role: String,
      },
    ],
  },
  { timestamps: true }
);

mongoose.model("List", ListSchema);
