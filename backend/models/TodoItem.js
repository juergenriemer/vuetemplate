const mongoose = require("mongoose");

const Model = {
  title : {
    type : "String"
    , required : true
    , display : "Todo"
    , minlength : 3
    , maxlength : 20 
  } 
  , done : {
    type : "Boolean"
    , display : "done!"
  } 
};

const Schema = new mongoose.Schema( Model,  { timestamps: true } );

module.exports = { Schema: mongoose.model("TodoItem", Schema), Model };
