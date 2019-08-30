const env = require('../environment').getEnvironment()
const svg = require('../assets/svg')
const fs = require('fs')
const path = require('path')
const utils = require('../utils')

var mapPages = null

const init = () =>{
  mapPages = {}
  try {
    loadPagesInMemory();
  } catch (error) {
    console.log(error);
  }
  console.log('page cache initialized!')
}

loadPagesInMemory = () => {
  utils.fromDir('./assets/html',/$/,function(filename){
    fs.readFile(filename, (err, data) => {
      if (!err) {
        const name = path.basename(filename)
        mapPages[name] = data;
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

const getPage = async (req, res, page) => {
  if (page){
    res.setHeader('server', env.server.html);
    res.setHeader('cache-control', 'public, max-age=' + env.cache.htmlMaxAge);
    res.setHeader('content-type', 'text/html');
    if ( page in mapPages) {
      res.end(mapPages[page])
    }
    else {
      fs.readFile('./assets/html/'+page, (err, data) => {
        if (err) {
          replyError(404, res)
        }
        else {
          res.end(data)
          mapPages[page] = data;
        }
      });
    }
  }
  else{
    replyError(404, res)
  }
}

module.exports = { init, getPage }