// Copied from: https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js

const querystring = require('querystring')
const request = require('request')

module.exports = (req, res, next) => {
  const client_id = process.env.CLIENT_ID
  const client_secret = process.env.CLIENT_SECRET
  const redirect_uri = 'http://localhost:5000/callback'
  const stateKey = 'spotify_auth_state'

  var code = req.query.code || null
  var state = req.query.state || null
  var storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === null || state !== storedState) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    )
  } else {
    res.clearCookie(stateKey)
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(client_id + ':' + client_secret).toString('base64'),
      },
      json: true,
    }

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          '/choice?' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        )
      } else {
        res.redirect(
          '/choice?' +
            querystring.stringify({
              error: 'invalid_token',
            })
        )
      }
    })
  }
}
