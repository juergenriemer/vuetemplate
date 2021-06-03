const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: "String",
      required: function () {
        return !this.imageFile;
      },
      xminlength: function () {
        return this.imageFile ? 0 : 1;
      },
      maxlength: 1000,
    },
    imageFile: {
      type: "String",
      minlength: 1,
      maxlength: 1000,
    },
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

const ListSchema = new mongoose.Schema(
  {
    title: {
      type: "String",
      required: true,
      minlength: 1,
      maxlength: 150,
    },
    description: {
      type: "String",
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [ItemSchema],
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
    users: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        email: String,
        name: String,
        short: String,
        role: String,
      },
    ],
    invitees: [
      {
        short: String,
        name: String,
        email: String,
        role: String,
      },
    ],
  },
  { timestamps: true }
);

mongoose.model("List", ListSchema);
