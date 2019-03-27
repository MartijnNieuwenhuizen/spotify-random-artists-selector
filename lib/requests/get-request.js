const fetch = require('node-fetch')

module.exports = async url => {
  const rawResponse = await fetch(url)
  return await rawResponse.json()
}
