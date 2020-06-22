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

    })

    .post(cors.corsWithOptions, async (req, res, next) => {

    })

    .delete(cors.corsWithOptions, async (req, res, next) => {

    })
