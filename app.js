import express from 'express';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';  
import session from 'express-session';  /* stores user sessions across different
browsers.  The credientials needed to authenticate a user are normally only transmitted
during the login request.  If authentication succeeds, a session will be established
and maintained via a cookie set in the user's browser.  So if a client makes a HTTP request,
and it doesn't contain a session cookie, a new session will be created by express-session.
Creating a new session:
     - generates a unique session ID, and stores it in a session cookie so that
     subsequent requests made by the client can be identified.
     - creates an empty session object as req.session
     - depending on the value of saveUninitialized, at the end of the request
       the session object will be stored in the session store (generally some
       sort of database)
Subsequent requests will not contain credients, but rather the unique cookie that
identifies the session */

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