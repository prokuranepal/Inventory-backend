const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Blood = require('../models/blood');
const bloodRouter = express.Router();


bloodRouter.use(bodyparser.json());

bloodRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })

  .get(cors.cors, (req, res, next) => {

    // const blood_check = {}

    // if (req.query.bloodGroup) {
    //   blood_check.bloodGroup= req.query.bloodGroup;
    //  }

    Blood.find({})
      .populate({
        path: 'healthpost'
      })
      .then((blood) => {
        console.log(blood);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blood);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .post(cors.cors, (req, res, next) => {

    Blood.create(req.body)
      .then((blood) => {
        res.statusCode = 200;
        res.setHeader('content-Type', 'application/json');
        res.json(blood);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .delete(cors.cors, (req, res, next) => {

    Blood.remove({})
      .then((blood) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          status: true,
          message: 'Successfully deleted'
        });
      }, (err) => next(err))
      .catch((err) => next(err));
  })


bloodRouter.route('/:bloodId')

  .get(cors.corsWithOptions, async (req, res, next) => {

    Blood.findOne({ _id: req.params.bloodId })
      .populate('healthpost')
      .then((blood) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blood);
      }, (err) => next(err))
      .catch((err) => next(err));

  })

  .put(cors.cors, (req, res, next) => {

    Blood.findByIdAndUpdate(req.params.bloodId, {
      $set: req.body
    }, {
      new: true
    })
      .then((blood) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blood);
      }, (err) => next(err))
      .catch((err) => next(err));
  })


  .delete(cors.cors, (req, res, next) => {

    Blood.findByIdAndRemove(req.params.bloodId)
      .then((blood) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          status: true,
          message: 'Successfully deleted'
        });
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = bloodRouter;