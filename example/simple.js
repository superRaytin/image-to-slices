'use strict';

var imageToSlices = require('../lib/index');

var lineXArray = [60, 250];
var lineYArray = [100, 200];
var source = './images/building.png';

imageToSlices(source, lineXArray, lineYArray, {
  saveToDataUrl: true
}, function(dataUrlList) {
  console.log('sliced', dataUrlList);
  var result = document.getElementById('result');
  pushDataURI(300, 300, dataUrlList, result);
});


function pushDataURI(width, height, list, parent) {
  parent = parent || document.body;

  var div = document.createElement('div');
  div.style.width = width + 30 + 'px';
  div.style.height = height + 'px';
  div.setAttribute('class', 'imageWrapper');

  parent.appendChild(div);

  list.forEach(function(item, index) {
    var div2 = document.createElement('div');
    var text = document.createElement('span');

    div2.setAttribute('class', 'item');
    text.innerHTML = 'section-' + (index + 1) + '<br><em>('+ item.x +', '+ item.y +', '+ item.width +', '+ item.height +')</em>';

    div2.appendChild(text);
    div.appendChild(div2);
    createImage(item.dataURI, div2);
  });
}

function createImage(dataUrl, parent) {
  var img = new Image();
  parent = parent || document.body;

  img.src = dataUrl;
  parent.appendChild(img);
}