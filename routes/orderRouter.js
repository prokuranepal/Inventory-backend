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
            .populate('created_User')
            .populate('orderItem.medicine')
            .then((order) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, async (req, res, next) => {
        Orders.create(req.body)
            .then((order) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order);
            }, (err) => next(err))
            .catch((err) => next(err));

    })

    .delete(cors.corsWithOptions, async (req, res, next) => {

        Orders.remove({})
            .then((order) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    status: true,
                    message: 'Successfully deleted'
                });
            }, (err) => next(err))
            .catch((err) => next(err));

    });


orderRouter.route('/:order_id')

    .get(cors.corsWithOptions, async (req, res, next) => {

        Orders.findOne(Orders.order_id)
            .populate('created_User')
            .populate('orderItem.medicine')
            .then((order) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.cors, (req, res, next) => {

        Orders.updateOne(Orders.order_id, {
            $set: req.body
        }, {
            new: true
        })
            .then((orderResult) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(orderResult);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.cors, (req, res, next) => {
        Orders.deleteOne(Orders.order_id)
            .then((order) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    status: true,
                    message: 'Successfully deleted'
                });
            }, (err) => next(err))
            .catch((err) => next(err));
    });


orderRouter.route('/:order_id/cancel')

    .post(cors.corsWithOptions, async (req, res, next) => {

        let data = Object.assign({}, { order_id: Orders.order_id }, req.body) || {}
        Orders.create(data)
            .then(order => {
                res.send(200, order)
                next()
            })
            .catch(err => {
                res.send(500, err)
            })

    })


module.exports = orderRouter;