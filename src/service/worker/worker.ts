/* eslint-disable no-restricted-globals */
import {
  FromPostMsg,
  FromWorkerMessageData,
  FromWorkerMessageType,
  ToPostMsg,
  ToWorkerMessageType,
} from './type';
import {
  addRelays,
  callApi,
  closePort,
  disconnect,
  listenFromPool,
  pullRelayStatus,
} from './pool';

//let count = 0;

/**
 * the worker and callWorker (1-to-many) are communicating through SharedWorker
 * while the worker and Pool(ws manager) instance (1-to-1) are communicating through eventEmitter
 */

const connectedPorts: (MessagePort | null)[] = [];

self.onconnect = (evt: MessageEvent) => {
  const port = evt.ports[0];
  port.start();
  port.onmessage = (event: MessageEvent) => {
    const res: ToPostMsg = event.data;
    const data = res.data;

    switch (res.type) {
      case ToWorkerMessageType.ADD_RELAY_URL:
        console.log('ADD_RELAY_URL');
        addRelays(data.urls!, data.portId);
        break;

      case ToWorkerMessageType.PULL_RELAY_STATUS:
        console.log('PULL_RELAY_STATUS');
        pullRelayStatus(data.portId);
        break;

      case ToWorkerMessageType.CALL_API:
        //console.log('CALL_API', data.callMethod!, data.callData!);
        callApi(data.callMethod!, data.callData!, data.portId);
        break;

      case ToWorkerMessageType.DISCONNECT:
        console.log('DISCONNECT');
        disconnect(data.portId);
        break;

      case ToWorkerMessageType.CLOSE_PORT:
        // console.log("port close!!!", data.portId);
        connectedPorts[data.portId] = null;
        closePort(data.portId);
        break;

      default:
        break;
    }
  };
  connectedPorts.push(port);

  // post the portId to callWorker
  const msg: FromPostMsg = {
    type: FromWorkerMessageType.PORT_ID,
    data: {
      portId: connectedPorts.length - 1,
    },
  };
  port.postMessage(msg);
};

listenFromPool(
  (message: FromWorkerMessageData) => {
    if (message.wsConnectStatus) {
      connectedPorts.forEach(port => {
        if (port != null)
          port.postMessage({
            data: message,
            type: FromWorkerMessageType.WS_CONN_STATUS,
          });
      });
    }
  },
  (message: FromWorkerMessageData) => {
    if (message.nostrData) {
      connectedPorts.forEach(port => {
        if (port != null)
          port.postMessage({
            data: message,
            type: FromWorkerMessageType.NOSTR_DATA,
          });
      });
    }
  },
);

self.addEventListener('disconnect', e => {
  // todo: seems not triggering?
  console.log('port disconnected', e);
});

export {};
