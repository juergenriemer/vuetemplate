var mongoose = require("mongoose");

const MachineSchema = new mongoose.Schema({
  name : String,
  description: String,
  ip: String,
  port:Number,
  type:String, // minecraft, webserver, 
  world:String,
  mode:Number,
  pvp:Boolean,
});

const Meta = {
  displayNames : {
    _id: "ID"
    , ip : "IP Adresse"
    , port : "Port Nummer"
  }
}

const Machine = { Schema: mongoose.model("Machine", MachineSchema), Meta };
module.exports = Machine;

