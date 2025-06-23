const mongoose = require('mongoose');
const gymSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        
    },
    userName:{
        type: String,
        required: true,
        
    },
    password:{
        type: String,
        required: true,
        
    },
    profilePic:{
        type: String,
        required: true,
        
    },
    gymName:{
        type: String,
        required: true,
        
    },
        
    // it will be use for forgot password.
    resetPasswordToken:{
        type: String,
        
    },
    resetPasswordExpires:{
        type: Date,
       
    }
},{
    timestamps: true
})

const model = mongoose.model('gym', gymSchema);

module.exports = model;