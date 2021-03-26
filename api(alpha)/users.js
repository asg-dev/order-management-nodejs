const express = require('express')
const router = express.Router()

const User = require('../models/user')

// *! TODO: Make sure all requests sit behind an auth

// ** Get Requests. List all agents and view an agent

 router.get('/api/agents', async (req, res) => {
     try {
        const agents = await User.find({ restaurant_agent: true, role: 1 })
        if(!agents) return res.status(404).send({message:'No data available'})
        res.status(200).send(agents)
     } catch (error) {
        res.status(500).send('Something went wrong')
     }
    })

 router.get('/api/agents/:id', async (req, res) => {
     try {
        const agent = await User.findOne({_id: req.params.id})
        if(!agent) return res.status(404).send({message:'No data available'})
        res.status(200).send(agent)
     } catch (error) {
        res.status(500).send('Something went wrong')
     }
    })

 // ** Create agents

router.post('/api/agents', async (req, res) => {
    try{
    
    const agent = await User.createAgent(req.body)
    res.status(201).send(agent)
    }
    catch(error)
    {
        res.status(500).send('Something went wrong')
    }
})

// ** Update agents

router.put('/api/agents/:id', async (req, res) => {
    const req_body = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'role']
    const isValid = req_body.every((field) => allowedUpdates.includes(field))
    if(!isValid) return res.status(400).send({error: 'Invalid field in request'})
    
    try {
        const agent = await User.findOneAndUpdate({_id: req.params.id}, {$set:req.body}, {new: true, runValidators:true})
        if (!agent) return res.status(404).send({error: 'User not found'})
        res.status(200).send(agent)
    } catch (error) {
        res.status(500).send('Something went wrong')
    }
})

// ** Delete agent

router.delete('/api/agents/:id', async (req, res) => {
    try {
        const agent = await User.findOneAndDelete({_id: req.params.id})
        if(!agent) return res.status(404).send({message:'The resource you are trying to delete does not exist'})
        res.status(204).send('No Content')
    } catch (error) {
        res.send(error)
    }
})


module.exports = router