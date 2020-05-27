
const Healthpost = require('../models/healthpost');
const cors = require('./cors');
const express = require('express');
const healthPostRouter = express.Router();
const bodyparser = require('body-parser');
// const mongoose = require('mongoose');
// const authenticate = require('../authenticate');

healthPostRouter.use(bodyparser.json());

healthPostRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })

  .get(cors.corsWithOptions, async (req, res, next) => {
    Healthpost.find({})
      .populate('medicine')
      .then((healthPost) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(healthPost);
      }, (err) => next(err))
      .catch((err) => next(err));

  })


  .post(cors.corsWithOptions, async (req, res, next) => {

    Healthpost.create(req.body)

      .then((healthPost) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(healthPost);
      }, (err) => next(err))
      .catch((err) => next(err));
  })


  .delete(cors.corsWithOptions, async (req, res, next) => {

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


  });


healthPostRouter.route('/:healthpostId')

  .get(cors.corsWithOptions, async (req, res, next) => {

    Healthpost.findOne({ _id: req.params.healthpostId })
      .populate('medicine')
      .then((healthPost) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(healthPost.medicine);
      }, (err) => next(err))
      .catch((err) => next(err));

  })

  .put(cors.cors, (req, res, next) => {

    Healthpost.findByIdAndUpdate(req.params.healthpostId,{
      $set: req.body
    }, {
      new: true
    })
      .then((medicineResult) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(medicineResult.medicine);
      }, (err) => next(err))
      .catch((err) => next(err));
  })


  .delete(cors.cors, (req, res, next) => {
    Healthpost.findByIdAndRemove( req.params.healthpostId )
    .then((healthPost) =>{
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