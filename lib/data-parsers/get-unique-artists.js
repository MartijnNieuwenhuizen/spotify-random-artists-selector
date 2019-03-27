module.exports = artists => {
  return artists.reduce((list, artist) => {
    const { id } = artist

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
