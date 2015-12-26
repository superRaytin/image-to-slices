
var Path = require('path');
var Clipper = require('image-clipper');
var Slices = require('slices');
var utils = require('./utils');

var isBrowser = utils.isBrowser();

function ImageToSlices(lineXArray, lineYArray, options) {
  options = options || {};

  this.lineXArray = utils.sortAndUnique(lineXArray) || [];
  this.lineYArray = utils.sortAndUnique(lineYArray) || [];

  // instance properties
  this.options = {};

  // extend instance properties with global defaults and initial properties
  utils.extend(this.options, this.defaults, options);

  // there are no reference lines
  if (!this.lineXArray.length && !this.lineYArray.length) {
    throw new Error('At least one reference line');
  }

  // throws when both saveToDir and saveToDataUrl does not be specified
  if (!this.options.saveToDir && !this.options.saveToDataUrl) {
    throw new Error('Either saveToDir or saveToDataUrl must be specified');
  }

  if (isBrowser && this.options.saveToDir && !this.options.saveToDataUrl) {
    throw new Error('Does not support saving as file in the Browser, use saveToDataUrl instead');
  }

  return this;
}

ImageToSlices.prototype.defaults = {
  saveToDir: null,
  saveToDataUrl: false,
  clipperOptions: null,
  middleBoundaryMode: false
};

/**
 * 按顺序裁切子区域
 *
 * @param {Object} children
 * @param {Number} parentBlockIndex, 父区域索引值
 * @param {Function} callback, 回调
 * */
ImageToSlices.prototype.clipChild = function(children, parentBlockIndex, callback) {
  // 复制一个对象操作
  var target = children.slice();

  var childBlockIndex = 1;
  var imageFormat = this.imageFormat;
  var exportPath = this.options.saveToDir || '';
  var saveToDataUrl = this.options.saveToDataUrl;
  var clipper = this.clipper;
  var dataUrlList = this.dataUrlList;

  function cropper() {
    var item = target.shift();
    var currentBlockIndex = childBlockIndex;
    var saveImageName = 'section-' + parentBlockIndex + '-' + currentBlockIndex + '.' + imageFormat;
    var saveFileName = Path.join(exportPath, saveImageName);

    childBlockIndex++;

    // 没有孩子节点了
    if (!item) {
      callback();
      return;
    }

    // 执行裁切
    clipper
        .reset()
        .crop(item.x, item.y, item.width, item.height);

    // 裁切图片后保存为 data URI
    if (saveToDataUrl) {
      clipper.toDataURL(function(dataUrl) {
        dataUrlList[parentBlockIndex - 1].children[currentBlockIndex - 1].dataURI = dataUrl;
        cropper();
      });
    }
    // 裁切图片后保存为文件
    else {
      clipper.toFile(saveFileName, function() {
        cropper();
      });
    }
  }

  cropper();
};

ImageToSlices.prototype.clip = function(blocks, callback) {
  var self = this;

  var exportPath = this.options.saveToDir || '';
  var saveToDataUrl = this.options.saveToDataUrl;
  var imageFormat = this.imageFormat;
  var clipper = this.clipper;
  var cloneBlocks = blocks.slice();
  var dataUrlList;

  if (saveToDataUrl) {
    dataUrlList = this.dataUrlList || (this.dataUrlList = cloneBlocks);
  }

  if (blocks.length) {
    // 按顺序切割区域
    var blockIndex = 1;

    function cropper() {
      var item = blocks.shift();
      var currentBlockIndex = blockIndex;
      var saveImageName = 'section-' + currentBlockIndex + '.' + imageFormat;
      var saveFileName = Path.join(exportPath, saveImageName);

      blockIndex++;

      // 所有区块切割完成
      if (!item) {
        if (callback) {
          if (saveToDataUrl) {
            callback(dataUrlList);
          } else {
            callback();
          }
        }
        return;
      }

      // 区块下有子区块
      if (item.children) {

        // 裁切图片后保存为文件
        // 先将大背景图导出，并抹除其中的主体部分像素
        // x 轴留出 20 像素是为了背景图和切出的图片融合效果更加完美
        var cleanX = item.boundary.leftTop.x + 20;
        var cleanY = item.boundary.leftTop.y;
        var cleanWidth = item.boundary.rightBottom.x - item.boundary.leftTop.x - 40;
        var cleanHeight = item.boundary.rightBottom.y - item.boundary.leftTop.y;

        // 在同一个实例上多次执行 crop, clear 等操作
        // 需要先执行 reset 以恢复初始的画布
        clipper
            .reset()
            .clear(cleanX, cleanY, cleanWidth, cleanHeight)
            .crop(item.x, item.y, item.width, item.height);

        // 保存为 data URI
        if (saveToDataUrl) {
          // 将挖空的大背景区域转为 data URI
          clipper.toDataURL(function(dataUrl) {
            dataUrlList[currentBlockIndex - 1].dataURI = dataUrl;
            self.clipChild(item.children, currentBlockIndex, cropper);
          });
        }
        // 保存为文件
        else {
          // 将挖空的大背景区域保存为文件
          clipper.toFile(saveFileName, function() {
            self.clipChild(item.children, currentBlockIndex, cropper);
          });
        }

      } else {

        // 执行裁切
        clipper
            .reset()
            .crop(item.x, item.y, item.width, item.height);

        // 裁切图片后保存为 data URI
        if (saveToDataUrl) {
          clipper.toDataURL(function(dataUrl) {
            dataUrlList[currentBlockIndex - 1].dataURI = dataUrl;
            cropper();
          });
        }
        // 裁切图片后保存为文件
        else {
          clipper.toFile(saveFileName, function() {
            cropper();
          });
        }
      }
    }

    cropper();
  }
};

ImageToSlices.prototype.slice = function(imagePath, callback) {
  var self = this;
  var options = this.options;
  var originalLineXArray = this.lineXArray;
  var originalLineYArray = this.lineYArray;

  this.imageFormat = utils.getFileFormat(imagePath);

  // inject node-canvas
  if (options.clipperOptions && options.clipperOptions.canvas) {
    Clipper.configure('canvas', options.clipperOptions.canvas);
  }

  Clipper(imagePath, function() {
    self.clipper = this;

    if (options.clipperOptions) {
      this.configure(options.clipperOptions);
    }

    var width = this.canvas.width;
    var height = this.canvas.height;

    // 生成参考线的 X Y 方向的边界
    originalLineXArray.push(height);
    originalLineYArray.push(width);

    self.lineXArray = utils.sortAndUnique(originalLineXArray);
    self.lineYArray = utils.sortAndUnique(originalLineYArray);

    var blocks = Slices(width, height, self.lineXArray, self.lineYArray, {
      middleBoundaryMode: options.middleBoundaryMode
    });

    self.clip(blocks, callback);
  });
};

/**
 * configure global default properties
 * properties changed in this object (same properties configurable through the constructor)
 * will take effect for every instance created after the change
 *
 * support both configure(name, value) and configure({name: value})
 * @param {String | Object} name, property name or properties list
 * @param {String | Undefined} value, property value or nothing
 * */
ImageToSlices.__configure = function(name, value) {
  var defaults = ImageToSlices.prototype.defaults;
  utils.setter(defaults, name, value);
};

module.exports = ImageToSlices;