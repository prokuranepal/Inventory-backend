const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const success_response = require('./functions/success_response');

const authenticate = require('../authenticate');
const cors = require('./cors');

const Hospital = require('../models/healthFacilities');

const hospitalRouter = express.Router();

hospitalRouter.use(bodyParser.json());

hospitalRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Hospital.find({
                type: 'hospital'
            })
            .populate('employee')
            .populate('medicine')
            .populate('drone')
            .then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.cors, (req, res, next) => {
        req.body.type = 'hospital';
        Hospital.create(req.body)
            .then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported /hospital`);
    })
    .delete(cors.cors, (req, res, next) => {
        Hospital.remove({
                type: 'hospital'
            })
            .then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

hospitalRouter.route('/:hospitalId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Hospital.findOne({
                _id: req.params.hospitalId,
                type: 'hospital'
            })
            .populate('employee')
            .populate('medicine')
            .populate('drone')
            .then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported /hospital/${req.params.hospitalId}`);
    })
    .put(cors.cors, (req, res, next) => {
        req.body.type = 'hospital';
        Hospital.findOneAndUpdate({
                _id: req.params.hospitalId,
                type: 'hospital'
            }, {
                $set: req.body
            }, {
                new: true
            }).then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.cors, (req, res, next) => {
        Hospital.findOneAndRemove({
                _id: req.params.hospitalId,
                type: 'hospital'
            })
            .then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = hospitalRouter;