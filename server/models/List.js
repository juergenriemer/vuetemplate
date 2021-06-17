const mongoose = require("mongoose");
const ItemSchema = require("./Item");

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
    type: "String",
    uniqueItems: Boolean,
    hideDoneItems: Boolean,
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
