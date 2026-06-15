const mongoose = require('mongoose');
const bcrypt=require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true, 
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6 // Basic validation for security
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
UserSchema.pre("save",async function(){
    if(!this.isModified("password")) return
    this.password  = await bcrypt.hash(this.password,12);
});

UserSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
};

module.exports = mongoose.model('User', UserSchema);