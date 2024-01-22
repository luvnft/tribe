import { Relay, RelayTracker } from 'core/relay/type';
import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useRelayGroupManager } from './useRelayManagerContext';
import { Nip11 } from 'core/nip/11';
import { RelayPoolDatabase } from 'core/relay/pool/db';
import { useRelayGroupsQuery } from './useRelayGroupsQuery';

export function useRelaysQuery(pubkey: string, groupId: string) {
  const groupManager = useRelayGroupManager(pubkey);
  const relayPoolDatabse = useMemo(() => new RelayPoolDatabase(), []);
  const { data: relayGroups } = useRelayGroupsQuery(pubkey);

  const getRelays = useCallback(async () => {
    const group = await groupManager.getGroupById(groupId);
    if (!group) {
      return [];
    }

    return group.relays.map(r => {
      const relay = relayPoolDatabse.load(r.url);
      return relay || r;
    });
  }, [groupManager, groupId, relayPoolDatabse]);

  const queryResult = useQuery(['relays', pubkey, groupId], getRelays, {
    onSuccess: relays => {
      const outdatedRelays = relays
        .filter(r => RelayTracker.isOutdated(r.lastAttemptNip11Timestamp))
        .map(r => r!.url);

      let newRelays: Relay[] = relays;
      if (outdatedRelays.length > 0) {
        Nip11.getRelays(outdatedRelays).then(details => {
          newRelays = relays.map(r => {
            if (details.map(d => d.url).includes(r.url)) {
              return details.filter(d => d.url === r.url)[0]!;
            } else {
              return r;
            }
          });

          if (newRelays.length > 0) {
            relayPoolDatabse.saveAll(newRelays);
          }
        });
      }
    },
  });

  useEffect(() => {
    if (!relayGroups) {
      return;
    }
    const group = relayGroups[groupId];
    const relays = queryResult.data || [];
    if (group?.relays && group.relays.length !== relays.length) {
      queryResult.refetch();
    }
  }, [relayGroups, groupId, queryResult]);

  return queryResult;
}
