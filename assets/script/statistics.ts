import socketPlugin from './SocketPlugin'
import Fingerprint2 from 'fingerprintjs2';

let Socket;

let browserId = localStorage.getItem('browserId');

const callback = function ({ ping }) {
  if (ping) {
    Socket.send({
      pong: ping
    })
  }
}

const createSocket = function () {
  const socketConfig = {
    url: `ws://192.168.110.89:8050/ws`,
    callback: callback,
    heartbeat: 3000,
    msg: {
      type: 0,
      msg: browserId
    }
  };
  Socket = new socketPlugin(socketConfig);
  Socket.connect();
}

const createFingerprint = function () {
  const fingerprint = Fingerprint2.get((components) => {
    const values = components.map(component => component.value);
    const murmur = Fingerprint2.x64hash128(values.join(''), 31);
    localStorage.setItem('browserId', murmur);
    console.log("murmur", murmur);
    browserId = murmur;
    createSocket()
  });
}

if (browserId) {
  createSocket()
} else {
  if (window.requestIdleCallback) {
    requestIdleCallback(() => {
      createFingerprint()
    });
  } else {
    setTimeout(() => {
      createFingerprint()
    }, 500);
  }
}

export default Socket