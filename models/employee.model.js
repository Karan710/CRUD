const crypto = require('crypto');
const { v1: uuidv1 } = require('uuid');
const mongoose = require('mongoose');


var employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String,
        required: true
    },
    encry_password:{
        type: String,
        required: true
    },
    salt: String,
    age: {
        type: Number
    },
    city: {
        type: String
    },
    dob:{
        type: Date
    },
    time:{
        type: String
    },
    rating:{
        type:String
    },
    vehicleOwned:{
        type:Array,
        default:[]
    },
    maritalStatus:{
        type:String
    },
    gender:{
        type:String,
        required: true
    }
}, {timestamps: true});

// Custom validation for email
employeeSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

//Encrypting the Password before storing in DB.

employeeSchema.virtual("password")
    .set(function(password){
        this._password= password
        this.salt= uuidv1();
        this.encry_password = this.securePassword(password)
    })
    .get(function(){
        return this._password
    })

employeeSchema.methods ={

    authenticate: function(plainpassword){
        return this.securePassword(plainpassword)=== this.encry_password
    },

    securePassword: function(plainpassword){
        if(!plainpassword) return ""
        try{ 
            return crypto.createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');
        }catch(err){
            return "";
        }
    }
}


mongoose.model('Employee', employeeSchema);