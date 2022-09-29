/*
-----User Model-----
-user schema
*/

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = mongoose.Schema({
    username:{type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true}
})

//static method to register the user
userSchema.statics.register = async function(username, password, email) {
    /*validation of user data */
  console.log('regis nta');
    console.log('*username',username);
    console.log('*email', email);

    /* check if we have values for username and password and send an error is one is empty */
    if(!username || !password || !email){
        throw Error("Please ensure that fields are filled")
    }

    /*check if the username is an email
    - validator.isEmail(username) will retunr true if valid email and false if not a valid email
    - ! in order to allow the if statement to run and throw an error when the email is not valid
    */
    if (!validator.isEmail(email)) {
        throw Error("Please ensure that you have entered a valid email address")
    }

    /*check password strength*/
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }
    

    const exists = await this.findOne({ email })
    /*check if the email exists*/
    if (exists) {
      throw Error("This email is already in use")
    }
  
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({ email, password: hash, username })
  
    return user
  }

  //static method to log the user in
  userSchema.statics.login = async function(email, password){

    /* check if we have values for username and password and send an error is one is empty */
    if(!email || !password){
        throw Error("Please ensure that all fields are filled")
    }

    /* check if the provided email exists in the database, if the email is does not exist then
    return a error */
    const user = await this.findOne({ email })
    if (!user) {
      throw Error("Please check if the email has been entered correctly")
    }
    
    /* check if the provided password for the user is correct, if the password is incorrect then
    return a error */
    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error("Incorrect Password")
    }
    return user
  }


module.exports = mongoose.model("User", userSchema);