const express = require('express')
var multer  = require('multer')
const router = express.Router()
const mongoose = require('mongoose')

const Menu = require('../models/menu')
const MenuItem = require('../models/menu_items')

const validator = require('../Utils/validator')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images/MenuItems')
    },
    filename: function(req, file, cb){
        cb(null, (new Date().toISOString())+"-MI_"+file.originalname)
     
    }
})

const upload = multer({storage})
const file = upload.single('image')


router.get('/admin/menu_items', async (req, res) => {
    try {
        const menuitems = await MenuItem.find().lean()
        res.render('menu_items', {
        layout: 'main',
        page_name: 'Admin',
        items: menuitems
    })        
    } catch (error) {
        req.flash('error_msg', `Something went wrong while loading the page.Error: ${error}
                                Please try again or contact support.`)
        res.redirect('/a/dashboard')
    }
})


router.get('/admin/menu_items/new', async (req,res) => {
    res.render('menuItem_create', 
    {
        page_name: 'Admin',
        layout: 'main'
    })
})


router.post('/admin/menu_items', file, async (req, res) => {
    try {
        if(req.file == undefined){
            const menuitem = new MenuItem(req.body)
            const menuItem = await menuitem.save()
            req.flash('success_msg', 'Menu Item created successfully')
            return res.redirect('/admin/menu_items')
        }
        
        const path = req.file.path
        const menu = new MenuItem({
            ...req.body,
            image: path.substring(path.indexOf("/"))
        })
    
        const menuItem = await menu.save()
        req.flash('success_msg', 'Menu Item created successfully')
        res.redirect('/admin/menu_items')
        
    } catch (error) {
        req.flash('error_msg', `Something went wrong. Error: ${error}
                                Please try again or contact support.`)
        res.redirect('/a/dashboard')
    }
})

router.post('/admin/:id/menu_items/quick_add', file, async (req, res) => {
    try {
        if(!validator.isValidMongoID({id:req.params.id})){
            req.flash('error_msg', `The menu might be removed or does not exist`)
            return res.redirect('/admin/menus')    
        }
        if(req.file == undefined){
            const menuitem = new MenuItem(req.body)
            const menuItem = await menuitem.save()
            req.flash('success_msg', 'Menu Item created successfully')
            return res.redirect('/admin/menus/'+req.params.id+'/add')
        }
        
        const path = req.file.path
        const menu = new MenuItem({
            ...req.body,
            image: path.substring(path.indexOf("/"))
        })
    
        const menuItem = await menu.save()
        req.flash('success_msg', 'Menu Item created successfully')
        res.redirect('/admin/menus/'+req.params.id+'/add')
        
    } catch (error) {
        req.flash('error_msg', `Something went wrong. Error: ${error}
                                Please try again or contact support.`)
        res.redirect('/a/dashboard')
    }
})



// ** render menu items page


router.get('/admin/menu_items/:id', async (req,res) => {
    try {
        if(!validator.isValidMongoID({id:req.params.id})){
            req.flash('error_msg', `The menu item might be removed or does not exist`)
            return res.redirect('/admin/menus')    
        }
        const menuitem = await MenuItem.findOne({_id:req.params.id})
        const name = menuitem.name
        const price = menuitem.price
        res.render('edit_menu_item', {
            page_name: 'Admin',
            layout: 'main',
            item_id:req.params.id,
            name: name,
            price: price
        })
    } catch (error) {
        req.flash('error_msg', `Something went wrong. Error: ${error}
                                Please try again or contact support.`)
        res.redirect('/a/dashboard')
    }
})

router.post('/admin/menu_items/:id', file, async(req, res) => {
    try {
        if(!validator.isValidMongoID({id:req.params.id})){
            req.flash('error_msg', `The menu item might be removed or does not exist`)
            return res.redirect('/admin/menus')    
        }
        if(req.file == undefined){
            const menuItem = await MenuItem.findOneAndUpdate({_id:req.params.id}, {$set:req.body}, {new:true, runValidators:true})
            req.flash('success_msg', 'Menu Item updated')
            return res.redirect('/admin/menu_items')
        }
        
        const path = req.file.path
        const menuItem = await MenuItem.findOneAndUpdate({_id: req.params.id}, {$set:{
            ...req.body,
            image: path.substring(path.indexOf("/"))
        }}, {new:true, runValidators: true})
    
        req.flash('success_msg', 'Menu Item updated')
        res.redirect('/admin/menu_items')
    } catch (error) {
        req.flash('error_msg', `Something went wrong. Error: ${error}
                                Please try again or contact support.`)
        res.redirect('/a/dashboard')
    }
})

router.delete('/admin/menu_items/:id', async (req, res) => {
    try {
        if(!validator.isValidMongoID({id:req.params.id})){
            req.flash('error_msg', `The menu item might be removed or does not exist`)
            return res.redirect('/admin/menus')    
        }
        await MenuItem.deleteOne({_id:req.params.id})
        req.flash('success_msg', 'Menu Item Deleted')
        res.redirect('/admin/menu_items')
    } catch (error) {
        req.flash('error_msg', `Something went wrong. Error: ${error}
                                Please try again or contact support.`)
        res.redirect('/a/dashboard')
    }
})

module.exports = router