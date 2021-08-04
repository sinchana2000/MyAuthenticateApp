const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport =  require('passport');

//accessing User.js in models folder
const User = require('../models/User');

//LOGIN PAGE
router.get('/login',(req,res)=>res.render('login'));
//Register PAGE
router.get('/register',(req,res)=>res.render('register'));
//Register handle
router.post('/register',(req,res)=>{
    const { name,email,password,password2 } = req.body;
    let errors=[];
    
//check for required fields
    if(!name ||!email || !password || !password2)
    {
        errors.push({msg:'Please fill in all fields'});
    }
    if(password!==password2)
    {
        errors.push({msg:'Passwords do not match'});
    }
    if(password.length<6)
    {
        errors.push({msg:'Password is should be atleast 6 characters'});
    }
    if(errors.length>0)
    {
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else
    {
        //validation user
        User.findOne({email:email})
        .then(user=>{
            if(user){
                errors.push({msg:'Email already exists'});
                res.render('register',{
                errors,
                name,
                email,
                password,
                password2
              }); 
            }
            else
            {
               const newUser = new User({
                   name,
                   email,
                   password
               });
               bcrypt.genSalt(10,(err,salt)=>
                bcrypt.hash(newUser.password, salt, (err,hash)=>{
                    if(err) throw err;
                    //set password to hash
                    newUser.password=hash;
                    //save user
                    newUser.save()
                    .then(user=>{
                        req.flash('success_msg','You are registered and good to login now!');
                        res.redirect('/users/login');
                    })
                    .catch(err=>console.log(err));

                })
               )
            }
        })
    }
});

//post to login handle
 router.post('/login',(req, res,next)=>{
     passport.authenticate('local',{
         successRedirect: '/dashboard',
         failureRedirect: '/users/login',
         failureFlash: true
     })(req,res,next);

});

//logout handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});

module.exports = router;