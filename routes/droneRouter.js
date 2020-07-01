const express = require('express');
const bodyparser = require('body-parser');
const cors = require('./cors');
const Drone = require('../models/drone');
const droneRouter = express.Router();
droneRouter.use(bodyparser.json());

droneRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, async (req, res, next) => {
        Drone.find({})
            .then((drones) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(drones);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, async (req, res, next) => {
        Drone.create(req.body)
            .then((drones) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(drones);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported /drone`);
    })
    .delete(cors.corsWithOptions, async (req, res, next) => {
        Drone.remove({})
            .then((drones) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(drones);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

droneRouter.route('/:droneId')

    .get(cors.corsWithOptions, (req, res, next) => {
        Drone.findById(req.params.droneId)
            .then((drone) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(drone);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported /drone/${req.params.droneId}`);
    })
    .put(cors.cors, (req, res, next) => {
        Drone.findByIdAndUpdate(req.params.droneId, {
            $set: req.body
        }, {
            new: true
        }).then((drone) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(drone);
        }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.cors, (req, res, next) => {
        Drone.findByIdAndRemove(req.params.droneId)
            .then((drone) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(drone);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = droneRouter;