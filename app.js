import express from 'express';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';  
import session from 'express-session';  

import flash from 'connect-flash';  //shows error messages
import passport from 'passport';  
import setUpPassport from './setuppassport.js';

import routes from './routes.js';

const __dirname = fileURLToPath(dirname(import.meta.url));

const app = express();

mongoose.connect("mongodb://localhost:27017/test");

setUpPassport();

app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false })); /* parses the forms.
The extended: false option makes the parsing simpler and more secure */
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",  //allows each session to be encrypted.  deters hacking into user's cookies
    resave: true,  /* required by middleware.  will update the session even when it's not modified, 
    which marks it as "active" in the session store.  some session stores will automatically
    delete idle(unused) sessions after some time.  */
    saveUninitialized: true  /* required boolean.  'true' will prevent emtpy session objects 
(req.session) from being deleted, so the server will be able to identify recurring visitors,
since the session id contained in the session cookie will be recognized.  */
}));
app.use(flash());

app.use(passport.initialize()); //1st step to set up Passport: set up middlware
app.use(passport.session()); //1st step to set up Passport: set up middlware

app.use(routes);

app.listen(app.get('port'), () => {
    console.log('Server started on port ' + app.get('port'));
});