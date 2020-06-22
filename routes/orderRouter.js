const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Orders= require('../models/orders');
const orderRouter = express.Router();


orderRouter.use(bodyparser.json());