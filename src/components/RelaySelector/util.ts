import { RelayFooterMenus, RelayMode } from './type';
import { WsConnectStatus } from 'core/worker/type';
import { ICascaderOption } from 'components/shared/Cascader/type';
import { Relay } from 'core/relay/type';

export function getSelectGroupId(groups: Record<string, Relay[]>) {
  return Object.keys(groups).filter(key => groups[key] != null);
}

export function getRelayGroupOptions(groups: Record<string, Relay[]>) {
  const ids = getSelectGroupId(groups);
  return ids.map(id => {
    return {
      value: id,
      label: `${id}(${groups[id]!.length})`,
      group: RelayMode.Group,
    };
  });
}

export function initModeOptions(groups: Record<string, Relay[]>) {
  const options: ICascaderOption[][] = [
    getRelayGroupOptions(groups),
    [
      {
        value: 'Relay Script',
        label: 'Relay Script (coming)',
        disabled: true,
      },
      ...getFooterMenus(),
    ],
  ];
  return options;
}

export function getFooterMenus() {
  return [
    {
      value: RelayFooterMenus.ManageRelays,
      label: 'Manage Relays..',
    },
  ];
}

export function isFastestRelayOutdated(
  timestamp: number,
  threshold: number = 5 * 60 * 1000,
): boolean {
  const currentTime = Date.now();
  return currentTime - timestamp > threshold;
}

export function toConnectStatus(
  label: string,
  wsConnectStatus: WsConnectStatus,
  all: number,
) {
  const connected = Array.from(wsConnectStatus).filter(
    ([_, isConnected]) => !!isConnected,
  ).length;
  return `${label} (${connected}/${all})`;
}

export function getConnectedRelayUrls(wsConnectStatus: WsConnectStatus) {
  const urls = Array.from(wsConnectStatus)
    .filter(([_, isConnected]) => !!isConnected)
    .map(([url]) => url);
  return urls;
}
