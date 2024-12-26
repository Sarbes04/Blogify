//password ki hashing ke liye hai ye
const{ createHmac, randomBytes } = require('crypto');
const { Schema, model } = require('mongoose');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL:{
        type: String,
        default: "/images/default.png",
    },
    role: {
        type: String,
        //matlab in dono values ke alawa kuch aur assign nahi kar sakte hum isme
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
}, {timestamps: true}
);

//jab bhi tum is user ko save karne lagoge, function chalega
//is like a middleware
userSchema.pre("save", function (next){
    const user = this; //this points to the current user

    //agar user ka password modify hi nahi hua to return
    if(!user.isModified("password")) return;

    //salt ek random string hai
    //har user ke liye banayenge hum, its like a 16 digit secret key
    const salt = randomBytes(16).toString();

    //sha256 is the algorithm that will be used
    //it will use salt to generate the hash
    //and will update the password
    //digest it and give it to me in hash form
    const hashedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});
//jab bhi hum user ko save karne ka try karenge, to pehle ye wala function run karega aur uske password ko hash kardega

//this is a mongo virtual function
//login ke time we will use the salt to convert given password into hash and if it matches with the hash in our database, we will login
userSchema.static('matchPasswordAndGenerateToken', async function(email, password){
    const user = await this.findOne({ email });
    if(!user){
        throw new Error('User not found!');
    }

    const salt = user.salt;
    const hashedPassword = user.password;
    //console.log(user);
    //we use the function to convert the given password to hash using the user's salt 
    const userProvidedHash = createHmac('sha256', salt)
    .update(password)
    .digest("hex");

    if(hashedPassword !== userProvidedHash){
        throw new Error('Incorrect Password');
    }
    //console.log(user);
    
    //match ho jaye to user return kardo, aur password aur salt ko hide kardo
    //return {...user._doc, password: undefined, salt: undefined};
    const token = createTokenForUser(user);
    return token;
}) 

const User = model('user', userSchema);

module.exports = User;