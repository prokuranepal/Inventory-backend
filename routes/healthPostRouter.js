
const express = require('express');
const Healthpost = require('../models/healthpost');
const authenticate = require('../authenticate');
const cors = require('./cors');
const healthPostRouter = express.Router();
const bodyparser = require('body-parser');

const mongoose = require('mongoose');
const config =require('../config');



healthPostRouter.use(bodyparser.json());

healthPostRouter.options('*', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  });





healthPostRouter.get('/',cors.corsWithOptions,async(req,res,next) => {

  

          Healthpost.find({})
          .populate('medicine')
          .then((healthPost)=>{
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
				res.json(healthPost);
			}, (err) => next(err))
			.catch((err) => next(err));
         
    })
          

healthPostRouter.post('/',cors.corsWithOptions,async(req,res,next) =>{

          
            Healthpost.create(req.body)
            
              .then((healthPost)=>{
                res.statusCode =200;
                res.setHeader('Content-Type', 'application/json');
            res.json(healthPost);
          }, (err) => next(err))
          .catch((err) => next(err));
              
          
          })



   healthPostRouter.delete('/',cors.corsWithOptions,async(req,res,next) => {

  
    Healthpost.remove({})
			.then((healthPost) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({
					status: true,
					message: 'Successfully deleted'
				});
			}, (err) => next(err))
			.catch((err) => next(err));


   })


  

  healthPostRouter.get('/:healthpostId',cors.corsWithOptions,async(req,res,next) => {

  

    Healthpost.findOne({_id:req.params.healthpostId})
    .populate('medicine')
    .then((healthPost)=>{
      res.statusCode =200;
      res.setHeader('Content-Type', 'application/json');
  res.json(healthPost.medicine);
}, (err) => next(err))
.catch((err) => next(err));
   
})

healthPostRouter.delete('/:healthpostId',cors.cors, (req, res, next) => {
  Healthpost.findOne({_id: req.params.healthpostId}).remove(Healthpost.medicine)
    .then((medicine) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        status: true,
        message: 'Successfully deleted'
      });
    }, (err) => next(err))
    .catch((err) => next(err));
});



  

module.exports = healthPostRouter;