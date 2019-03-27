const querystring = require('querystring')

// Helpers
const flatten = require('../../lib/flatten')
const getRandomIdFromSelection = require('../../lib/get-random-id-from-selection')

// Functional helpers
const curry = require('../../lib/functional/curry')
const recurringRequest = require('../../lib/functional/recurring-request')

// Request helpers
const requestArtists = require('../../lib/requests/request-artists')
const requestArtistDetails = require('../../lib/requests/request-artist-details')

// Data parsers
const artistsParser = require('../../lib/data-parsers/artists-parser')
const getUniqueArtists = require('../../lib/data-parsers/get-unique-artists')

module.exports = async (req, res, next) => {
  // Create the URL
  const access_token = req.query.access_token
  const query = querystring.stringify({ type: 'artist', limit: 50 })
  const url = `https://api.spotify.com/v1/me/tracks?${query}`

  // Create the interfaces
  const responseParser = curry(flatten)(artistsParser)
  const artistRequest = recurringRequest(requestArtists)(responseParser)
  const artistSelector = curry(getRandomIdFromSelection)(getUniqueArtists)

  // Execute request
  const artists = await artistRequest(url, access_token)

  // Artists selection
  const chosenArtistKey = artistSelector(artists)

  // Data gathering
  const artistDetails = await requestArtistDetails(
    chosenArtistKey,
    access_token
  )

  const artistsAsObject = getUniqueArtists(artists)
  const number = artistsAsObject[chosenArtistKey]

  // Rendering
  res.send(`<figure>
  <figcaption>${artistDetails.name}</figcaption>
  <img src="${number.images[0].url}" alt="A picture of ${artistDetails.name}"/>
  </figure>`)
}
