## Blog App
 # Simple blog app where i can create , Edit and delete blogs.

## Authorization
    - Install Following packages
        - npm install passport passport-local passport-local-mongoose express-session --save
    - Import these packages in app.js
        - passport = require('passport');
        - localStrategy = require('passport-local');
    - Create User Model
    - Inside User Model write following: var passporrLocalMongoose  = require('passport-local-mongoose'); 
    - then userSchema.plugin(passporrLocalMongoose);
    ## Configure Passport
        - app.use(require("express-session")({
            secret : "This is the blog site",
            resave : false,
            saveUninitialized : false
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(new localStrategy(User.authenticate()));
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());