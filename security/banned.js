
const utils = require('../utils')

var listIpBanned = []
var listIpRequest = []
const MAX_IPs_BANNED = 500
const MAX_IPs_REQUEST = 100

function isAttackDoS(data) {
  listIpRequest.push(data)
  if (listIpRequest.length<=MAX_IPs_REQUEST) return false;

  for (var i = 0; i < listIpRequest.length - 1; i++) {
    if ((listIpRequest[i].ipRemote !== listIpRequest[i+1].ipRemote) || (listIpRequest[i].proxy !== listIpRequest[i+1].proxy)){
      return false;
    }
  }
  const dif = listIpRequest[listIpRequest.length - 1].ts - listIpRequest[0].ts;
  listIpRequest = [];
  if (dif<1000) {
    return true;
  }
  return false;
}

exports.isBanned = (req) => {
  const ipRemote = req.connection.remoteAddress?req.connection.remoteAddress:'n/d'
  const proxy = req.headers['x-forwarded-for']?req.headers['x-forwarded-for']:'n/d'
  const data = {
    ipRemote: ipRemote,
    proxy: proxy,
    ts: new Date().getTime()
  }
  if (isAttackDoS(data)){
    console.log('Attack DoS detected! => ' + data)
    listIpBanned.push(data);
    if (listIpBanned.length>MAX_IPs_BANNED){
      listIpBanned = listIpBanned.slice(1,MAX_IPs_BANNED)
    }
  }
  return (listIpBanned.filter(data => (data.ipRemote===ipRemote||data.proxy===proxy)).length>0)
}


