const querystring = require('querystring')

const recurringRequest = requestMethod => requestParser => async (
  url,
  token,
  existing = []
) => {
  // Request
  const rawResponse = await requestMethod(url, token)

  // Handle response
  const response = requestParser(rawResponse)
  const artists = [...existing, ...response]

  // Use recursion if needed
  if (rawResponse.next) {
    const query = querystring.stringify({ token })
    const newUrl = `${rawResponse.next}&${query}`
    const requestInterface = recurringRequest(requestMethod)(requestParser)

    return requestInterface(newUrl, token, artists)
  }

  return artists
}

module.exports = recurringRequest
