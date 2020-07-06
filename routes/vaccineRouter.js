const express = require('express');
const bodyparser = require('body-parser');
const cors = require('./cors');
const Vaccine = require('../models/vaccine');

const vaccineRouter = express.Router();

// const mongoose = require('mongoose');
// const authenticate = require('../authenticate'
vaccineRouter.use(bodyparser.json());

vaccineRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })

    .get(cors.corsWithOptions, async (req, res, next) => {
        Vaccine.find({})
            .populate('hospital')
            .then((vaccine) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(vaccine);
            }, (err) => next(err))
            .catch((err) => next(err));

    })


    .post(cors.corsWithOptions, async (req, res, next) => {

        Vaccine.create(req.body)

            .then((vaccine) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(vaccine);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


    .delete(cors.corsWithOptions, async (req, res, next) => {

        Vaccine.remove({})
            .then((vaccine) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    status: true,
                    message: 'Successfully deleted'
                });
            }, (err) => next(err))
            .catch((err) => next(err));


    });


vaccineRouter.route('/:vaccineId')

    .get(cors.corsWithOptions, async (req, res, next) => {

        Vaccine.findOne({ _id: req.params.vaccineId })
            .populate('hospital')
            .then((vaccine) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(vaccine);
            }, (err) => next(err))
            .catch((err) => next(err));

    })

    .put(cors.cors, (req, res, next) => {

        Vaccine.findByIdAndUpdate(req.params.vaccineId, {
            $set: req.body
        }, {
            new: true
        })
            .then((vaccine) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(vaccine);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


    .delete(cors.cors, (req, res, next) => {
        Vaccine.findByIdAndRemove(req.params.vaccineId)
            .then((vaccine) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    status: true,
                    message: 'Successfully deleted'
                });
            }, (err) => next(err))
            .catch((err) => next(err));
    });



module.exports = vaccineRouter;