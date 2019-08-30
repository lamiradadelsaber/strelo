const fs = require('fs')
const path = require('path')

function fromDir (startPath,filter,callback) {
  console.log('Starting from dir '+startPath+'/');
  if (!fs.existsSync(startPath)){
    console.log("no dir ",startPath);
    return;
  }
  var files=fs.readdirSync(startPath);
  for (var i=0;i<files.length;i++){
    const filename=path.join(startPath,files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()){
        fromDir(filename,filter,callback);
    }
    else if (filter.test(filename)) callback(filename);
  };
};


module.exports = { fromDir }