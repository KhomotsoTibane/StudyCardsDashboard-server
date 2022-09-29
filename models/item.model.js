/*
-----Item Model-----
-item schema
*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    topic:{type:String, required:true},
    item:{type:Object, required:true},
    user:{type: mongoose.SchemaTypes.ObjectId,required:true}
}, {timestamps:true})

module.exports = mongoose.model("Item", itemSchema);