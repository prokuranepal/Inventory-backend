const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/users');
const session = require('express-session');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const async = require('async');
const xoauth2 = require('xoauth2');



const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

const userRouter = express.Router();

userRouter.use(bodyParser.json());


userRouter.options('*', cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
});

userRouter.get('/signup', function(req, res) {
  res.render('signup', {
    user: req.user
  });
});

userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register(new User({
    email: req.body.email,
    phonenumber: req.body.phonenumber,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }), req.body.password, function (err, user) {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      if (err.errmsg && (err.errmsg).includes('phonenumber')) {
        var phoneError = {};
        phoneError.name = 'PhoneNumberExistsError';
        phoneError.message = 'User with Phone number already exists';
        return res.json({
          err: phoneError
        });
      }
      return res.json({
        err: err
      });
    } else {
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            err: err
          });
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success: true,
            status: 'Registration Successful'
          });
        });
      });
    }
  });
});

userRouter.get("/login", function(req, res){
  res.render('login'); 
});


userRouter.post('/login', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.redirect('/login');
      // return res.json({
      //   success: false,
      //   status: 'Login Unsuccessful',
      //   err: info
      // });
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.redirect('/')
        // return res.json({
        //   success: false,
        //   status: 'Login Unsuccessful',
        //   err: 'Could not log in user'
        // });
      }

      var token = authenticate.getToken({
        _id: req.user._id
      });

      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({
        success: true,
        token: token,
        status: 'Login successful'
      });
    });
  })(req, res, next);
});

userRouter.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

userRouter.get('/forgot', cors.corsWithOptions, function(req, res) {
  res.render('forgot', {
    user: req.user
  });
});

userRouter.post('/forgot', cors.corsWithOptions, (req, res, next) => {
  async.waterfall([

    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          // req.flash('error', 'No account with that email address exists.');
          return res.redirect('/users/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      var smtpTransport = nodemailer.createTransport( {
       
        service: 'Gmail',
        auth: {
            
          user: 'kk0388639@gmail.com',
          pass: 'lpcontlerhygxnct'
          
        }
    
      });
      var mailOptions = {
        from: 'kk0388639@gmail.com',
        to: user.email,
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://localhost:3000 /users/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        // req.send('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('/users/forgot');
  });

});

userRouter.get('/checkJWTToken', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('jwt', {
    session: false
  }, (err, user, info) => {
    if (err) next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        status: 'JWT Invalid!',
        success: false,
        err: info
      });
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        status: 'JWT valid!',
        success: true,
        user: user
      });
    }
  })(req, res);
});


module.exports = userRouter;
