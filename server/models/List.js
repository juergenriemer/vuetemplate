const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: "String",
      required: true,
      minlength: 1,
      maxlength: 1000,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

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
    comments: [CommentSchema],
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
