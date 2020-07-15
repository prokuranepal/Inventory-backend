const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/users');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const async = require('async');

const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

const userRouter = express.Router();

userRouter.use(bodyParser.json());


userRouter.options('*', cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
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



userRouter.post('/login', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');

      return res.json({
        success: false,
        status: 'Login Unsuccessful',
        err: info
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json')
        return res.json({
          success: false,
          status: 'Login Unsuccessful',
          err: 'Could not log in user'
        });
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
          return res.json({
            success: false,
            status: 'unsuccessful'
          });
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      var smtpTransport = nodemailer.createTransport({

        service: 'Gmail',
        auth: {

          user: 'kk0388639@gmail.com',
          pass: 'lpcontlerhygxnct'

        },
        tls: {
          rejectUnauthorized: false
        }

      });
      var mailOptions = {
        from: 'kk0388639@gmail.com',
        to: user.email,
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          token + '\n\n' + 'This token is for changing your password ' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        res.json({ status: 'success', message: 'An e-mail has been sent to ' + user.email + ' with further instructions.' + token + '\n\n' + 'Click the link below to reset your password' });
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) return next(err);
    err;
  });

});

userRouter.get('/reset/:token', function (req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({
        success: false,
        status: 'Password reset token is invalid or has expired.'
      });

    }
    else {
      return res.json({
        status: 'success',
        message: 'Token found'
      })
    }
  })

});

userRouter.post('/reset/:token', function (req, res) {
  async.waterfall([
    function (done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
          res.json({ message: 'Password reset token is invalid or has expired.' });
        }

        user.password = req.body.password;
        user.setPassword(user.password, function (err) {
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function (err) {
            req.logIn(user, function (err) {
              done(err, user);
            });
          });
        })

      });
    },
    function (user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'kk0388639@gmail.com',
          pass: 'lpcontlerhygxnc'
        },
        tls: {
          rejectUnauthorized: false
        }

      });
      var mailOptions = {
        to: user.email,
        from: 'kk0388639@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };

      smtpTransport.sendMail(mailOptions, function (err) {
        res.json({ status: 'success', message: 'An e-mail has been sent to ' + user.email + 'and the password has been sucessfully changed' });
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) return err;
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
