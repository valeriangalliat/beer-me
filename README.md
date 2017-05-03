# beer-me [![npm version](http://img.shields.io/npm/v/beer-me.svg?style=flat-square)](https://www.npmjs.org/package/beer-me)

> Library to (not so) randomly pick beers for you.

Requirements
------------

This library works with a list of beers from the
[metro online grocery][metro] website that you can extract using
[feed-me].

[metro]: https://www.metro.ca/en/online-grocery/
[feed-me]: https://github.com/valeriangalliat/feed-me

```js
const metro = require('feed-me')
const fs = require('fs')

metro.getAllResults({ category: 'beverages/beer-cider' })
  .then(JSON.stringify)
  .then(json => fs.writeFileSync('beers.json', json))
```

The expected format of a beer object is the following:

```json
{
  "brand": "Brasserie Dieu du Ciel!",
  "name": "Disco Soleil kumquats IPA strong beer",
  "weight": "341 ml - bottle",
  "price": 2.39,
  "image": {
    "small": "https://product-images.metro.ca/images/h0b/h4c/8883933675550.jpg",
    "large": "https://product-images.metro.ca/images/h41/h2e/8883934593054.jpg"
  },
  "link": "https://www.metro.ca/en/online-grocery/aisles/beverages/beer-cider/artisanal-beer-microbrewery/disco-soleil-kumquats-ipa-strong-beer/p/696859060489",
  "category": "beverages/beer-cider/artisanal-beer-microbrewery"
}
```

For convenience, I added a static version of that list in the
[`beers`](https://github.com/valeriangalliat/beer-me/tree/beers) branch.

Usage
-----

```js
const beer = require('beer-me')
const beers = require('./beers')

console.log(beer.beerMe(beers, 48))
```

You will get a selection of beers in the same format, but with a number
of items that will match the desired number of beers (given as second
argument).

### Getting actual beers

For some reason, even if you search in the `beverages/beer-cider`
categories, you get, stuff that is definitely not beer:

* `beverages/beer-cider/cider`
* `beverages/beer-cider/non-alcoholic-beer`
* `beverages/juices-drinks/sparkling-juices-drinks`
* `beverages/soft-drinks/ginger-ale`
* `beverages/wines-cocktails-coolers/cocktails-other-wines`
* `beverages/wines-cocktails-coolers/sparkling-wine`

By calling:

```js
const actualBeers = beers.filter(beer.isActualBeer)
```

You get only beers from the following categories:

* `beverages/beer-cider/artisanal-beer-microbrewery`
* `beverages/beer-cider/classic-beer`
* `beverages/beer-cider/classic-light-beer`
* `beverages/beer-cider/imported-beer`
* `beverages/beer-cider/specialty-flavoured-beer`

### Parsing beer format

```js
beer.parseFormat('740•ml - can') // { count: 1, size: 740, type: 'can' }
beer.parseFormat('24x330•ml - cans') // { count: 24, size: 330, type: 'cans' }
beer.parseFormat('1.18•L - bottle') // { count: 1, size: 1180, type: 'bottle' }
beer.parseFormat('12x341•ml - bottles') // { count: 12, size: 341, type: 'bottles' }
```

You can also use the following:

```js
const parsedBeers = beers.map(beer.formatify)
```

After what all the beers will have a `format` property with the `count`,
`size` and `type`.

This is especially useful to filter beers:

```js
const packsOfCans = parsedBeers.filter(beer => beer.format.type === 'cans')
const packsOfBottles = parsedBeers.filter(beer => beer.format.type === 'bottles')
const bigPacksOfBottles = packsOfBottles.filter(beer => beer.count >= 24)
```

## Real life example

Get packs of between 12 and 24 bottles (less than 500 ml) of beer from a
given list of brands, to get a total of 48 bottles:

```js
const beer = require('beer-me')
const beers = require('./beers')
const brands = require('./brands') // An array of brand names to pick.

const set = beers
  .filter(beer.isActualBeer)
  .map(beer.formatify)
  .filter(beer => beer.type === 'bottles')
  .filter(beer => beer.count >= 12 && beer.count <= 24)
  .filter(beer => beer.size < 500)
  .filter(beer => brands.includes(beer.brand))

const selection = beer.beerMe(set, 48)
```
