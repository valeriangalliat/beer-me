const shuffle = require('shuffle-array')

exports.beerCategories = [
  'beverages/beer-cider/artisanal-beer-microbrewery',
  'beverages/beer-cider/classic-beer',
  'beverages/beer-cider/classic-light-beer',
  'beverages/beer-cider/imported-beer',
  'beverages/beer-cider/specialty-flavoured-beer'
]

exports.isActualBeer = beer =>
  exports.beerCategories.includes(beer.category)

exports.parseFormat = weight => {
  const matches = weight.match(/^(?:(\d+)x)?([\d.]+)(?:\u00A0| )(ml|L)(?: - (\w+))?$/)

  if (!matches) return {}

  const [ count = 1, size, unit, type = 'unknown' ] = matches.slice(1)

  return {
    count: Number(count),
    size: Number(size) * (unit === 'L' ? 1000 : 1),
    type
  }
}

exports.formatify = beer =>
  Object.assign({ format: exports.parseFormat(beer.weight) }, beer)

// Pick items from a set of beers until the desired amount of bottles is
// reached.
exports.selectBeers = (beers, desiredBottles) => {
  let selection = []
  let bottles = 0

  for (let beer of beers) {
    selection.push(beer)
    bottles += beer.format.count

    if (bottles >= desiredBottles) break
  }

  return selection
}

// Pick a random selection of beers from the given beer set to meet the
// desired number of bottles.
//
// There's two passes of `selectBeers` after a sort by pack size to
// return the minimum amount of extra beers (sorry).
exports.beerMe = (beers, desiredBottles) =>
  exports.selectBeers(exports.selectBeers(shuffle(beers), desiredBottles)
    .sort((a, b) => b.format.count - a.format.count), desiredBottles)
