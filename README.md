# image-to-slices
> Node.js module for converting image into slices by the given reference lines. Backed by [Slices](https://github.com/superRaytin/slices) and [image-clipper](https://github.com/superRaytin/image-clipper).

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

If you want to use it on the server-side Node.js, you'll need previously install [node-canvas](https://github.com/Automattic/node-canvas):

```
npm install canvas
```

# Quick Start

```js
var imageToSlices = require('image-to-slices');

var lineXArray = [100, 200];
var lineYArray = [100, 200];
var source = '/path/to/image.jpg'; // width:300, height:300

imageToSlices(source, lineXArray, lineYArray, {
    saveToDir: '/path/to/'
}, function() {
    console.log('The source image has been sliced into 9 sections!');
});
```

# API

### imageToSlices(source, lineXArray, lineYArray [, options], callback)

- **source:** the path where the source image. Keep in mind that [origin policies](https://en.wikipedia.org/wiki/Same-origin_policy) apply to the image source, and you may not use cross-domain images without [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).
- **lineXArray:** reference lines of the X axis
- **lineYArray:** reference lines of the Y axis
- **options:** slice with some optional parameters, see [options](#options) for detail.
- **callback:** a function to be executed when slicing is complete.

## Options

### saveToDir

The directory path where the image slices will be saved.

> Note that the path must be really exists.

### middleBoundaryMode

Either true or false, default is false.

If set to true, this will put spaces between each two X axis as parent-block,
the areas between the first Y axis and last Y axis will be children of the parent-block, and it will generate boundary data.

See [Slices#middleBoundaryMode](https://github.com/superRaytin/slices#middleboundarymode) for detail.

### clipperOptions

Configure properties for [image-clipper](https://github.com/superRaytin/image-clipper).

See [image-clipper#configure-options](https://github.com/superRaytin/image-clipper#clipperconfigureoptions) for detail.

### saveToDataUrl

You should either `saveToDir: true` or `saveToDataUrl: true`, default is false.

If set to true, then it will doesn't save the image slices to file but rather return data url of the slices.

```js
ImageToSlices('path/to/image.jpg', [100, 300], [100], {
  saveToDataUrl: true
}, function(dataUrlArray) {
  console.log('sliced!', dataUrlArray);
});
```

The `dataUrlArray` returned will be like below:

```js
[
    '1': 'data:image/jpeg;base64,....',
    '2': 'data:image/jpeg;base64,....',
    ...
    '6': 'data:image/jpeg;base64,....'
]
```

## Where is this library used?

If you are using this library in one of your projects, add it in this list :)

- [Puzzler](https://github.com/superRaytin/puzzler)

# Testing

```
npm test
```

# License

MIT, see the [LICENSE](/LICENSE) file for detail.
