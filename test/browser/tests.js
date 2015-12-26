
var imageToSlices = window.imageToSlices;

var pngImagePath = '../../example/building.png';
var exportDir = '../../example/';
var pushToBody = true;

var lineXArray;
var lineYArray;

imageToSlices.configure({
  clipperOptions: {
    quality: 20
  }
});

function dataToUrl(width, height, list) {
  var div = document.createElement('div');
  div.style.width = width + 30 + 'px';
  div.style.height = height + 'px';
  div.setAttribute('class', 'imageWrapper');

  document.body.appendChild(div);

  list.forEach(function(item) {
    var span = document.createElement('span');
    div.appendChild(span);
    createDOM(item.dataURI, span);
  });
}

function createDOM(dataUrl, parent) {
  var img = new Image();
  parent = parent || document.body;

  img.src = dataUrl;
  parent.appendChild(img);
}

describe('image-to-slices', function() {
  it('saveToDataUrl works', function(done) {
    lineXArray = [40, 260];
    lineYArray = [60, 180];

    imageToSlices(pngImagePath, lineXArray, lineYArray, {
      saveToDataUrl: true
    }, function(dataUrlList) {
      should.exist(dataUrlList);
      dataUrlList.length.should.equal(9);
      pushToBody && dataToUrl(300, 300, dataUrlList);
      done();
    });
  });

  it('middleBoundaryMode works', function(done) {
    lineXArray = [100, 200];
    lineYArray = [100, 200, 250];

    imageToSlices(pngImagePath, lineXArray, lineYArray, {
      saveToDataUrl: true,
      middleBoundaryMode: true
    }, function(dataUrlList) {
      should.exist(dataUrlList);
      dataUrlList.length.should.equal(3);
      dataUrlList[0].children.length.should.equal(2);
      done();
    });
  });

  it('clipperOptions works', function(done) {
    lineXArray = [100, 200];
    lineYArray = [100, 200, 250];

    imageToSlices(pngImagePath, lineXArray, lineYArray, {
      saveToDataUrl: true,
      middleBoundaryMode: true,
      clipperOptions: {
        quality: 10
      }
    }, function(dataUrlList) {
      dataUrlList.length.should.equal(3);
      dataUrlList[0].children.length.should.equal(2);
      done();
    });
  });

  it('throws when "saveToDir: $DIR" and "saveToDataUrl: false" in the Browser', function(done) {
    try {
      imageToSlices(pngImagePath, lineXArray, lineYArray, {
        saveToDir: exportDir,
        saveToDataUrl: false
      }, function() {
        true.should.equal(false);
        done();
      });
    } catch(e) {
      e.message.should.equal('Does not support saving as file in the Browser, use saveToDataUrl instead');
      done();
    }
  });

  it('throws when both save directory and saveToDataUrl does not be specified', function(done) {
    try {
      imageToSlices(pngImagePath, lineXArray, lineYArray, {
        saveToDir: null,
        saveToDataUrl: false
      }, function() {
        true.should.equal(false);
        done();
      });
    } catch(e) {
      e.message.should.equal('Either saveToDir or saveToDataUrl must be specified');
      done();
    }
  });

  it('throws when lineXArray and lineYArray is empty', function(done) {
    lineXArray = [];
    lineYArray = [];

    try {
      imageToSlices(pngImagePath, lineXArray, lineYArray, {
        saveToDir: exportDir,
        middleBoundaryMode: true,
        clipperOptions: {
          quality: 20
        }
      }, function() {
        true.should.equal(false);
        done();
      });
    } catch(e) {
      e.message.should.equal('At least one reference line');
      done();
    }
  });
});