const querystring = require('querystring')
const getRequest = require('./get-request')

module.exports = async (url, access_token) => {
  const query = querystring.stringify({ access_token })
  const urlWithToken = `${url}&${query}`
  return await getRequest(urlWithToken)
}
