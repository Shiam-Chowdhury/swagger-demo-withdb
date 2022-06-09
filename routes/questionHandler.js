const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const questionSchema = require('../schemas/questionSchema');
const authorSchema = require('../schemas/authorSchema');
const Question = new mongoose.model('Question', questionSchema);
const Author = new mongoose.model('Author', authorSchema);
const checkLogin = require('../middlewares/checkLogin');

router.get('/', checkLogin, (req, res) => {
    Question.find({ status: 'active'}, (err, data) => {
        if(err){
            res.status(500).json({
                error: 'internal server error!'
            })
        }else{
            res.status(200).json({
                result: data,
            })
        }
    })
});

router.get('/questions-with-author', (req, res) => {
    Question.find({ status: 'active'}).populate("author", "-_id -__v -questions -status").select({
        _id: 0,
        date: 0,
        __v: 0
    }).exec((err, data) => {
        if(err){
            res.status(500).json({
                error: 'internal server error!'
            })
        }else{
            res.status(200).json({
                result: data,
            })
        }
    });
});

router.post('/', async (req, res) => {
    try {
        const newQuestion = new Question({
            ...req.body,
            user: req.authorId
        });

        const question = await newQuestion.save();

        await Author.updateOne({
            _id: req.authorId
        },{
            $push: {
                questions: question._id
            }
        });

        res.status(200).json({
            message: 'question created successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            error,
            message: 'server error!'
        });
    }
});

module.exports = router;