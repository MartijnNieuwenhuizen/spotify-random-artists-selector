// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat

module.exports = input => {
  const stack = [...input]
  const res = []
  while (stack.length) {
    // pop value from stack
    const next = stack.pop()
    if (Array.isArray(next)) {
      // push back array items, won't modify the original input
      stack.push(...next)
    } else {
      res.push(next)
    }
  }
  //reverse to restore input order
  return res.reverse()
}
