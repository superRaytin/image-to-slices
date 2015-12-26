'use strict';

var imageToSlices = require('./image-to-slices');
var utils = require('./utils');

function ImageToSlicesFactory(imagePath, lineXArray, lineYArray, options, callback) {
  checkArgs.apply(null, arguments);

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var slices;

  if (options) {
    slices = new imageToSlices(lineXArray, lineYArray, options);
  } else {
    slices = new imageToSlices(lineXArray, lineYArray);
  }

  return slices.slice(imagePath, callback);
}

// check arguments
function checkArgs(imagePath, lineXArray, lineYArray) {
  if (utils.type(imagePath) !== 'String' ||
      utils.type(lineXArray) !== 'Array' ||
      utils.type(lineYArray) !== 'Array') {
    throw new Error('Invalid arguments.');
  }
}

// Configure default properties
ImageToSlicesFactory.configure = function(name, value) {
  imageToSlices.__configure(name, value);
};

module.exports = ImageToSlicesFactory;

// If we're in the browser,
// define it if we're using AMD, otherwise leak a global.
if (typeof define === 'function' && define.amd) {
  define(function() {
    return ImageToSlicesFactory;
  });
} else if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
  window.imageToSlices = ImageToSlicesFactory;
}