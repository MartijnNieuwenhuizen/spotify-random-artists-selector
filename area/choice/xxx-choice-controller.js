const querystring = require('querystring')

const curry = require('../../lib/curry')
const flatten = require('../../lib/flatten')
const requestArtists = require('../../lib/requests/request-artists')
const requestArtistDetails = require('../../lib/requests/request-artist-details')
const getRandomIdFromSelection = require('../../lib/get-random-id-from-selection')

const requestSavedArtists = requestMethod => requestParser => async (
  url,
  token,
  existing = []
) => {
  // Get all artists
  const rawResponse = await requestMethod(url, token)
  const response = requestParser(rawResponse)

  // Handle data
  const artists = [...existing, ...response]

  // Use recursion if needed
  if (rawResponse.next) {
    const query = querystring.stringify({ token })
    const newUrl = `${rawResponse.next}&${query}`
    const requestInterface = requestSavedArtists(requestMethod)(requestParser)

    return requestInterface(newUrl, token, artists)
  }

  return artists
}

const parseArtists = data => {
  return data.items.map(track => {
    return track.track.artists.map(({ name, id, href }) => ({
      name,
      href,
      id,
      images: track.track.album.images,
    }))
  })
}

const prepareArtistsForSelection = artists => {
  return artists.reduce((list, artist) => {
    const { id, name } = artist

    if (list[id]) {
      list[id].count = list[id].count + 1
      return list
    }

    list[id] = {
      ...artist,
      count: 1,
    }
    return list
  }, {})
}

module.exports = async (req, res, next) => {
  const access_token = req.query.access_token

  // Create the URL
  const query = querystring.stringify({
    type: 'artist',
    limit: 50,
  })
  const url = `https://api.spotify.com/v1/me/tracks?${query}`

  // Create the interfaces
  const responseParser = curry(flatten)(parseArtists)
  const artistRequest = requestSavedArtists(requestArtists)(responseParser)
  const artistChooser = curry(getRandomIdFromSelection)(
    prepareArtistsForSelection
  )

  // Execute request
  const artists = await artistRequest(url, access_token)

  // Chooses artist
  // const artistsAsObject = prepareArtistsForSelection(artists)
  // const chosenArtistKey = getRandomIdFromSelection(artistsAsObject)
  const chosenArtistKey = artistChooser(artists)

  // Specific artists info
  const artistsAsObject = prepareArtistsForSelection(artists)

  const number = artistsAsObject[chosenArtistKey]
  const artistInfo = await requestArtistDetails(chosenArtistKey, access_token)

  res.send(`<figure>
  <figcaption>${artistInfo.name}</figcaption>
  <img src="${number.images[0].url}" alt="A picture of ${artistInfo.name}"/>
  </figure>`)

  // Add  play button and play the top  track of the artist!
}
