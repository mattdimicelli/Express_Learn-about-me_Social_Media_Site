import express from 'express';
import User from './models/user.js';
import passport from 'passport';

const router = express.Router();

router.use((req, res, next) => {
    res.locals.currentUser = req.user; //user object populated by Passport
    res.locals.errors = req.flash('error');
    res.locals.infos = req.flash('info');
    next();
});

router.get('/', (req, res, next) => {
    User.find()
    .sort({ createdAt: 'descending'})
    .exec((err, users) => { // this actually executes the query
        if(err) return next(err);
        res.render('index', { users: users });
    });
});

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.post('/signup', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username: username }, (err, user) => {
        if (err) return next(err);
        if (user) {
            req.flash('error', 'User already exists');
            return res.redirect('/signup');
        }

        const newUser = new User({
            username: username,
            password: password,
        });
        newUser.save(next);
    });
}, passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true,  /* flash an error message using the message given by the 
    strategy's verify callback */
}));

router.get('/users/:username', (req, res, next) => {
    User.findOne({ username: req.params.username }, (err, user) => {
        if (err) return next(err);
        if (!user) return next(404);
        res.render('profile', { user });
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true /* flash an error message using the message given by the 
    strategy's verify callback */
}));

router.get('/logout', (req, res) => {
    req.logout(); // a new function added by Passport
    res.redirect('/');
});

router.get('/edit', ensureAuthenticated, (req, res) => {
    res.render('edit');
});

router.post('/edit', ensureAuthenticated, (req, res, next) => {
    /* normally this would be a PUT request, but browsers only support
    GET and POST in HTML forms */
    req.user.displayName = req.body.displayname;
    req.user.bio = req.body.bio;
    req.user.save(err => {
        if (err) {
            next(err);
            return;
        }
        req.flash('info', 'Profile updated!');
        res.redirect('/edit');
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {  // function provided by Passport
        next();
    } else {
        req.flash('info', 'You must be logged in to see this page.');
        res.redirect('/login');
    }
}

export default router;