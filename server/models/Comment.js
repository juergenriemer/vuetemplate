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

module.exports = CommentSchema; //mongoose.model("Comment", CommentSchema);
