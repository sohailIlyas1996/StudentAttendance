const mongoose = require('mongoose');
const mongodbConnect=mongoose.connect('mongodb+srv://sohaililyas487:admin123@cluster0.biprxao.mongodb.net/Attendance?retryWrites=true&w=majority')
// Define the Student schema

const plm=require('passport-local-mongoose')

const adminSchema = new mongoose.Schema({
  name: String,
  username:String,
  password:String,
  email: String,
  
});

adminSchema.plugin(plm);



// Create a model based on the schema
module.exports =mongoose.model('Admin', adminSchema);

