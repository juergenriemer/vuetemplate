const mongoose = require("mongoose");

const Model = {
  title : {
    type : "String"
    , required : true
    , display : "XTitle"
    , minlength : 3
    , maxlength : 20 
  } 
  , description : {
    type : "String"
    , display : "Description"
    , minlength : 3
    , maxlength : 200 
  } 
  , prio : {
    type : "Boolean"
    , display : "has priority"
  } 
  , year : {
    type : "Number"
    , display : "Year"
    , min : 1900
    , max : 2050
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
module.exports = { Schema: mongoose.model("Post", Schema), Model };