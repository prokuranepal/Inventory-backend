const Suppliers = require('../models/suppliers');
const cors = require('./cors');
const express = require('express');
const suppliersRouter = express.Router();
const bodyparser = require('body-parser');

suppliersRouter.use(bodyparser.json());


suppliersRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })

    .get(cors.cors, (req, res, next) => {
        Suppliers.find({})
            .then((supplier) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(supplier);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.cors, (req, res, next) => {
        Suppliers.create(req.body)
            .then((supplier) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(supplier);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.cors, (req, res, next) => {
        Suppliers.remove({})
            .then((supplier) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    status: true,
                    message: 'Successfully deleted'
                });
            }, (err) => next(err))
            .catch((err) => next(err));
    })


suppliersRouter.route('/:suppliersId')

    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })

    .get(cors.cors, (req, res, next) => {
        Suppliers.findById({ _id: req.params.suppliersId })
            .then((supplier) => {
                console.log(supplier);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(supplier);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.cors, (req, res, next) => {
        Suppliers.findByIdAndUpdate(req.params.suppliersId, {
            $set: req.body
        }, {
            new: true
        })
            .then((modifiedData) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(modifiedData);
            }, (err) => next(err))
            .catch((err) => next(err));

    })

    .delete(cors.cors, (req, res, next) => {
        Suppliers.deleteOne({ _id: req.params.suppliersId })
            .then((supplier) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    status: true,
                    message: 'Successfully deleted'
                });
            }, (err) => next(err))
            .catch((err) => next(err));

    })


module.exports = suppliersRouter;