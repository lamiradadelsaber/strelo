const env = require('../environment').getEnvironment()
const svg = require('../assets/svg')
const fs = require('fs')
const path = require('path')
const utils = require('../utils')

var mapImages = null

const init = () =>{
  mapImages = {}
  try {
    loadImagesInMemory();
  } catch (error) {
    console.log(error);
  }
  console.log('image cache initialized!')
}

loadImagesInMemory = () => {
  utils.fromDir('./assets/img',/$/,function(filename){
    fs.readFile(filename, (err, data) => {
      if (!err) {
        const name = path.basename(filename)
        mapImages[name] = data;
        console.log('\t' + name);
      }
    });
  });
}

const replyError = async (code, res) => {
  if (!res.finished){
    res.writeHead(code, { 'Content-Type': 'image/svg+xml; charset=utf-8' });
    res.end(svg.svgBug);
  }
}

const getImage = async (req, res, img) => {
  if ((img) && ((img.includes('.jpg')) || (img.includes('.png')) || (img.includes('.svg')))){
    res.setHeader('server', env.server.images);
    res.setHeader('cache-control', 'public, max-age=' + env.cache.imageMaxAge);
    if (img.includes('.jpg')) res.setHeader('content-type', 'image/jpeg');
    else if (img.includes('.png')) res.setHeader('content-type', 'image/png');
    else if (img.includes('.svg')) res.setHeader('content-type', 'image/svg+xml');
    if (img in mapImages) {
      res.end(mapImages[img])
    }
    else {
      fs.readFile('./assets/img/'+img, (err, data) => {
        if (err) {
          replyError(404, res)
        }
        else {
          res.end(data)
          mapImages[img] = data;
        }
      });
    }
  }
  else{
    replyError(404, res)
  }
}

module.exports = { init, getImage }