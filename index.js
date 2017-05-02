const metro = require('feed-me')

metro.getAllResults({ category: 'beverages/beer-cider' })
  .then(beers => JSON.stringify(beers, null, 2))
  .then(console.log)
