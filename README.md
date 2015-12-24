# image-to-slices
> Node.js module for converting image into slices by the given reference lines

[![Build Status](https://travis-ci.org/superRaytin/image-to-slices.svg?branch=master)](https://travis-ci.org/superRaytin/image-to-slices)
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]

[![image-to-slices](https://nodei.co/npm/image-to-slices.png)](https://npmjs.org/package/image-to-slices)

[npm-url]: https://npmjs.org/package/image-to-slices
[downloads-image]: http://img.shields.io/npm/dm/image-to-slices.svg
[npm-image]: http://img.shields.io/npm/v/image-to-slices.svg

# Installation

```
npm install image-to-slices
```

# Quick Start

```js
var imageToSlices = require('image-to-slices');

var lineXArray = [100, 200];
var lineYArray = [100, 200];
var imagePath = '/path/to/image.jpg'; // width:300, height: 300

imageToSlices(imagePath, lineXArray, lineYArray, {
    saveToDir: '/path/to/'
}, function() {
    console.log('The source image has been sliced into 9 sections!');
});
```

# API



## Where is this library used?

If you are using this library in one of your projects, add it in this list :)

- [Puzzler](https://github.com/superRaytin/puzzler)

# Testing

```
npm test
```

# License

MIT, see the [LICENSE](/LICENSE) file for detail.
