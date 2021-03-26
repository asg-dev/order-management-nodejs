const express = require ('express')
const router = express.Router()
const User = require('../models/user')
const Auth = require('../middleware/auth')
const passport = require('passport')
const validator = require('../Utils/validator')
const Cart = require('../models/cart')

//sign up requests

router.get('/users/register', (req, res) => {
    res.render('register', {name: 'Register', layout: 'login'})
})

router.post('/users/register', async (req, res) => {
    const errors = await  validator.validateRequest(req)
    if(errors.length > 0) {
        req.flash('error', errors)
        return res.redirect('/users/register') 
    }
    const user = new User(req.body)
    try{
        await user.save();
        req.flash('success_msg', `Hi! You have successfully registered. You can now login`)
        res.redirect('/users/login')    
    }
    catch (error){
        console.log(error)
        req.flash('error_msg', `${error}`)
        res.redirect('/users/register')    
    }
    
})

//login requests

router.get('/users/login', Auth.isLoggedIn, (req, res) => {
    res.render('login', {layout: 'login', name:'Login'})
})


router.post('/users/login',
    
    passport.authenticate('local', { 
    failureRedirect: '/users/login',
    failureFlash: true }),(req, res, next) => {
        if(req.user.restaurant_agent == false){
            res.redirect('/orders/new')
        }
        else{
            res.redirect('/a/dashboard')
        }
})



//logut requests

router.get('/logout', async (req, res)=>{
    const isCart = Cart.find({user_id:req.user._id})
    if(isCart != null || isCart != undefined) await Cart.findOneAndDelete({user_id:req.user._id})
    req.logout()
    req.flash('success_msg', 'Successfully logged out!')
    res.redirect('/users/login')
})



module.exports = router