const mongoose = require("mongoose");
const CommentSchema = require("./Comment");

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
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastAction: Date,
    lastSeen: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        seen: Date,
      },
    ],
  },
  { timestamps: true }
);

mongoose.model("Item", ItemSchema);
