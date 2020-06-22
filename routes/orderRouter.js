const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Orders = require('../models/orders');
const orderRouter = express.Router();


orderRouter.use(bodyparser.json());

orderRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })

    .get(cors.corsWithOptions, async (req, res, next) => {
        Orders.find({})
        .populate('orderItem','created_User')
        .then((order) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(order);
        }, (err) => next(err))
        .catch((err) => next(err));
    

    })

    .post(cors.corsWithOptions, async (req, res, next) => {

    })

    .delete(cors.corsWithOptions, async (req, res, next) => {

    })
