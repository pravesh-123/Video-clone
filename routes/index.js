const express = require('express');
const router = express.Router();
const { v4: uuidv4}= require("uuid");           //using version 4 of uuid

let room;

router.get('/', (req, res) =>{
    room= `${uuidv4()}`;
    res.render('home', {roomId: room});
})

router.get('/settings', (req, res) =>{
    res.render('settings');
})

router.get('/:room', (req, res) =>{
    res.render('room', {roomId: req.params.room});
})


// router.get('*', (req, res) =>{      // Handling non-existing routes
//     res.render('error');
// })


module.exports = router;