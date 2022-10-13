const jwt = require('jsonwebtoken')
let token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    data: 'foobar'
  }, 'secret');

  console.log(token)