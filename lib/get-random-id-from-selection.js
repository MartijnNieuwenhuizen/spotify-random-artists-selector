const getRandomNumber = require('./random-number-generator')

module.exports = artists => {
  const amountOfArtists = Object.keys(artists).length
  const randomArtistNumber = getRandomNumber(0, amountOfArtists)

  return Object.keys(artists)[randomArtistNumber]
}
