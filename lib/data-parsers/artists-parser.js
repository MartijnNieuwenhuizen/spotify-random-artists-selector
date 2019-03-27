module.exports = data => {
  return data.items.map(track => {
    return track.track.artists.map(({ name, id, href }) => ({
      name,
      href,
      id,
      images: track.track.album.images,
    }))
  })
}
