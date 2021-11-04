import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

/* Models can serve as simple objects that store database values, but in 
Mongo they also perform many other things like data validation, extra methods,
etc */

// the following defines the number of times the bcrypt alogrithm is run, 
// so the higher the number, the more secure the hash will be.
// A salt is additional random data that is added to a one-way function to 
// generate a hash.
const SALT_FACTOR = 10;

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    displayName: String,
    bio: String
});

userSchema.methods.name = function() {
    return this.displayName || this.username
};

userSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, (err, isMatch) => {
        done(err, isMatch);
    });
    /* bcrypt.compare is used instead of a simple equality check
    to keep safe from timing attacks */
};

//the following is for a pre-save (of the model to the database) action to hash
// the password

// a do-nothing function for use by the bcrypt module
const noop = () => {};

userSchema.pre('save', function(done) {
    const user = this;
    if (!user.isModified("password")) {
        return done;
    }
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) return done(err);
        bcrypt.hash(user.password, salt, noop, (err, hashedPassword) => {
            if (err) return done(err);
            user.password = hashedPassword;
            done();
        });
    });
});

const User = mongoose.model("User", userSchema);
export default User;
