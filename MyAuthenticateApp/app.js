const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose')
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//passport config
require('./config/passport')(passport);

//db config
const db = require('./config/keys').mongoURI;

// connect to mongo
mongoose.connect(db,{useNewUrlParser:true , useUnifiedTopology: true }).then(()=>console.log('MongoDB connected..')).catch(err =>console.log(err));

//ejs
app.use(expressLayouts);
app.set('view engine','ejs');

//bodyparser
app.use(express.urlencoded({extended:false}));

//middleware for express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global flash
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/' , require('./routes/index'));
app.use('/users' , require('./routes/users'));

const PORT = process.env.PORT || 5000;


app.listen(PORT,console.log(`Server started on port ${PORT}`));

