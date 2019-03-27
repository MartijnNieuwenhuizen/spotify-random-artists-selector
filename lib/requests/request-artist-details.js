const querystring = require('querystring')
const getRequest = require('./get-request')

module.exports = async (chosenArtistKey, access_token) => {
  const query = querystring.stringify({ access_token })
  const artistInfoRequestUrl = `https://api.spotify.com/v1/artists/${chosenArtistKey}?${query}`

  return await getRequest(artistInfoRequestUrl)
}
