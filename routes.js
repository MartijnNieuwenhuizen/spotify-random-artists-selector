const express = require('express')
const router = express.Router()

const loginMiddleware = require('./area/authorize/login-middleware')
const loginCallbackController = require('./area/authorize/login-callback-middleware')

const landingController = require('./area/landing/landing-controller')
const choiceController = require('./area/choice/choice-controller')

/**
 * @param {Object} app
 */
function register(app) {
  // Interface routes
  router.get('/', landingController)
  router.get('/choice', choiceController)

  // Authorization routes
  router.use('/login', loginMiddleware)
  router.use('/callback', loginCallbackController)

  app.use(router)
}

module.exports = { register }
