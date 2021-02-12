const mongoose = require("mongoose");

const Model = {
  title : {
    type : "String"
    , required : true
    , display : "XTitle"
    , minlength : 3
    , maxlength : 20 
  } 
  , prio : {
    type : "Boolean"
    , display : "has priority"
  } 
};

//creationDate: { type: Date, default: Date.now },

// const Schema = new mongoose.Schema({
//   title: String,
//   description: String,
//   prio: Boolean,
//   year: Number
// });

const Schema = new mongoose.Schema( Model,  { timestamps: true } );

// const Meta = {
//   displayNames : {
//     _id: "ID"
//     , title: "Post Title"
//   }
// }
module.exports = { Schema: mongoose.model("Todo", Schema), Model };
