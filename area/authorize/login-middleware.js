// Parsley copied from: https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js

const querystring = require('querystring')
const generateRandomString = require('../../lib/random-string-generator')

module.exports = (req, res, next) => {
  const client_id = process.env.CLIENT_ID
  const redirect_uri = 'http://localhost:5000/callback'
  const stateKey = 'spotify_auth_state'
  const scope =
    'user-read-private user-library-read user-follow-read user-read-email'

  var state = generateRandomString(16)
  res.cookie(stateKey, state)

  const baseUrl = 'https://accounts.spotify.com/authorize?'
  const urlPayload = querystring.stringify({
    response_type: 'code',
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state,
  })

  const redirectUrl = `${baseUrl}${urlPayload}`
  res.redirect(redirectUrl)
}
