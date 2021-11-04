import User from './models/user.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';  /* the third and final part
of setting up Passport is setting up a strategy, which is the actual authentification.
A strategy could be authetnicating with FB or Google; this option is a local 
strategy, which means that some Mongoose code must be written  */

// Look for a user with the supplied username
passport.use('login', new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
        if (err) return done(err);
        if (!user) {
            return done(null, false, { message: 'No user has that username!' });
        }
        user.checkPassword(password, (err, isMatch) => {
            if (err) return done(err);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid password.' });
            }
        });
    });
}));



function setUpPassport() {
    /* serialize and deserialize users: turn a user's session into a user object (instance)
    and vice-versa.  This is the second (out of three) steps of setting up Passport 
    (the first is setting up the middleware) */

    // Gets the session ID from the user object
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    /* turns the session ID into the user object/instance, looking up the user in Mongo by 
    the session ID, which is the same as the _id property. */
    passport.deserializeUser((_id, done) => {
        User.findById(_id, (err, user) => {
            done(err, user);
        });
    });
}

export default setUpPassport;