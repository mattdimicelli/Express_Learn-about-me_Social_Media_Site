# Readme
# NodeJS Learn About Me 

## Overview

--INCOMPLETE PROJECT--

This is a project adapted from a book called *Express in Action*, by Evan M. Hahn (2016).  Unfortunately, much of the code from the tutorial no longer worked.  As this tutorial really couldn't be followed due to so many issues, I moved onto other things instead of spending the time to fix it.  But many parts of it do work.  It is a simple social media website.  


### Links

- [Repo](https://github.com/mattdimicelli/learn-about-me)

## My process

### Built with

- Node.js
- Express 
- express-session 
- cookie-parser, required for user sessions
- bcyrpt-nodejs, which hashes passwords to prevent real passwords from being stored in the datbase.  It also allows password "guesses" to be compared to the actual password without using a simple equality check, which keeps the user safe from a timing attack
- Mongoose
- EJS for views and partials
- connect-flash, shows error messages
- passport, middleware to authenticate requests


### What I learned

Notes that I took when writing this app: 

"Express-session allows you to store user sessions across different
browsers.  The credientials needed to authenticate a user are normally only transmitted during the login request.  If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.  So if a client makes a HTTP request, and it doesn't contain a session cookie, a new session will be created by express-session.

Creating a new session:
     - generates a unique session ID, and stores it in a session cookie so that subsequent requests made by the client can be identified.
     - creates an empty session object as req.session
     - depending on the value of saveUninitialized, at the end of the request the session object will be stored in the session store (generally some sort of database)
  
Subsequent requests will not contain credients, but rather the unique cookie that identifies the session"

