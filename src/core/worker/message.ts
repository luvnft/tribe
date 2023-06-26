import { Pool } from './pool';
import {
  FromConsumerMsg,
  FromConsumerMsgType,
  RelayInfoMsg,
  FromProducerMsgType,
  SubFilterResultMsg,
  PubEventResultMsg,
} from './type';

// messaging between backend sharedWorker and frontpage caller
export const createPortOnMessageListener = ({
  pool,
  port,
  connectedPorts,
}: {
  pool: Pool;
  port: MessagePort;
  connectedPorts: (MessagePort | null)[];
}) => {
  return (event: MessageEvent) => {
    const res: FromConsumerMsg = event.data;
    const type = res.type;
    switch (type) {
      case FromConsumerMsgType.switchRelays:
        {
          console.log('SWITCH_RELAYS');
          const data = res.data;
          pool.doSwitchRelays(data.switchRelays!);
        }
        break;

      case FromConsumerMsgType.pullRelayInfo:
        {
          console.log('PULL_RELAY_INFO');
          const data = res.data;
          const msg: RelayInfoMsg = {
            id: pool.switchRelays.id,
            relays: pool.switchRelays.relays,
            wsConnectStatus: pool.wsConnectStatus,
            portId: data.portId,
          };
          port.postMessage({
            data: msg,
            type: FromProducerMsgType.relayInfo,
          });
        }

        break;

      case FromConsumerMsgType.subFilter:
        {
          console.log('SUB_FILTER');
          const data = res.data;
          const subs = pool.subFilter(data);
          subs.forEach(async sub => {
            for await (const event of sub) {
              const msg: SubFilterResultMsg = {
                event,
                subId: sub.id,
                relayUrl: sub.url,
                portId: data.portId,
              };
              port.postMessage({
                data: msg,
                type: FromProducerMsgType.event,
              });
            }
            sub.unsubscribe();
          });
        }
        break;

      case FromConsumerMsgType.pubEvent:
        {
          console.log('PUB EVENT');
          const data = res.data;
          const pubs = pool.pubEvent(data);
          pubs.forEach(async pub => {
            for await (const result of pub) {
              const msg: PubEventResultMsg = {
                isSuccess: result.isSuccess,
                reason: result.reason,
                relayUrl: result.relayUrl,
                portId: data.portId,
                eventId: data.event.id,
              };
              port.postMessage({
                data: msg,
                type: FromProducerMsgType.pubResult,
              });
            }
          });
        }
        break;

      case FromConsumerMsgType.disconnect:
        {
          console.log('DISCONNECT');
          pool.closeAll();
        }

        break;

      case FromConsumerMsgType.closePort:
        {
          const data = res.data;
          connectedPorts[data.portId] = null;
          //todo
          // closePort(data.portId);
        }
        break;

      default:
        break;
    }
  };
};
