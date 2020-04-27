const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');

const Medicines = require('../models/medicines');

const medicineRouter = express.Router();

medicineRouter.use(bodyParser.json());

medicineRouter.route('/')
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, (req, res, next) => {
		Medicines.find({})
			.then((medicines) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(medicines);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.post(cors.cors, (req, res, next) => {
		Medicines.create(req.body)
			.then((medicine) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(medicine);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.put(cors.cors, (req, res, next) => {
		var error = new Error('PUT operation is not supported');
		error.statusCode = 403;
		next(error);
	})
	.delete(cors.cors, (req, res, next) => {
		Medicines.remove({})
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

medicineRouter.route('/:medicineId')
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, (req, res, next) => {
		Medicines.findById(req.params.medicineId)
			.then((medicine) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(medicine);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.post(cors.cors, (req, res, next) => {
		var error = new Error('POST operation is not supported');
		error.statusCode = 403;
		next(error);
	})
	.put(cors.cors, (req, res, next) => {
		Medicines.findByIdAndUpdate(req.params.medicineId, {
				$set: req.body
			}, {
				new: true
			})
			.then((medicine) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(medicine);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.delete(cors.cors, (req, res, next) => {
		Medicines.findByIdAndRemove(req.params.medicineId)
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

module.exports = medicineRouter;