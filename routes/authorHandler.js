const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authorSchema = require("../schemas/authorSchema");
const Author = new mongoose.model('Author', authorSchema);

router.post('/signup', async (req, res) => {
    try {
        //hashing the requested password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //creating new user
        const newAuthor = new Author({
            email: req.body.email,
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword
        });
        await newAuthor.save();

        res.status(200).json({
            message: 'signup successfull!'
        });
    } catch(err) {
        res.status(500).json({
            message: 'signup failed!',
            err
        });
    }
});

router.post('/signin', async (req,res) => {
    const author = await Author.findOne({ email: req.body.email});

    if(author){
        const isValidPassword = await bcrypt.compare(req.body.password, author.password);

        try {
            if(isValidPassword){
                const token = jwt.sign({
                    email: req.body.email,
                    authorId: author._id
                },process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });
    
                res.status(200).json({
                    token,
                    message: 'login successfull'
                })
            }else{
                res.status(401).json({
                    message: 'login failed!',
                });
            }  
        } catch (error) {
            res.status(500).json({
                message: 'signin failed!',
                error
            });
        }

    }
});

router.get('/all', async (req, res) => {
    try {
        const authors = await Author.find({
            status: 'active'
        }).populate('questions').select({
            __v: 0
        });

        res.status(200).json({
            authors
        });
    } catch (error) {
        res.status(500).json({
            error,
            message: 'server error!',
        });
    }
})

module.exports = router;