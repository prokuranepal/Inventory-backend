const express = require('express');
const bodyparser = require('body-parser');
const cors = require('./cors');
const Vaccine = require('../models/vaccine');

const vaccineRouter = express.Router();

// const mongoose = require('mongoose');
// const authenticate = require('../authenticate'
