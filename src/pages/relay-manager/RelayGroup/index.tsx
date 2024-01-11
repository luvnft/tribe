import { Button } from 'components/shared/ui/Button';
import { RelayGroup as RelayGroupClass } from 'core/relay/group';
import { useMemo, useState } from 'react';
import { FiFolder, FiPlus } from 'react-icons/fi';
import { cn } from 'utils/classnames';
import RelayGroupTable from './table';

interface RelayGroupProps {
  groups: RelayGroupClass | undefined;
}

interface RelayGroupListProps {
  groups: RelayGroupClass | undefined;
  selectedGroupId: string;
  onSelectedGroupIdChange: (groupId: string) => void;
}

function RelayGroupList(props: RelayGroupListProps) {
  const { groups, selectedGroupId, onSelectedGroupIdChange } = props;

  return (
    <div className="flex-1 overflow-scroll">
      <div className="label text-text-secondary px-5 py-2 flex items-center">
        My Groups
      </div>
      <div>
        {groups?.getAllGroupIds().map(groupId => (
          <div
            key={groupId}
            className={cn(
              'flex items-center gap-2 h-10 px-5 py-2 cursor-pointer',
              'hover:bg-conditional-hover01',
              {
                'selected bg-conditional-selected02':
                  groupId === selectedGroupId,
              },
            )}
            onClick={() => onSelectedGroupIdChange(groupId)}
          >
            <FiFolder className="h-4 w-4 text-text-secondary" />
            <div className="w-full flex justify-between items-center">
              <span className="flex-1 line-clamp-1 label text-text-primary selected:font-semibold capitalize">
                {groupId}
              </span>
              <span className="footnote text-text-secondary">
                {groups.getGroupById(groupId)?.length}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RelayGroup(props: RelayGroupProps) {
  const { groups } = props;
  const [selectedGroupId, setSelectedGroupId] = useState<string>('default');
  const activeGroup = useMemo(
    () => groups?.getGroupById(selectedGroupId),
    [groups, selectedGroupId],
  );

  return (
    <div className="flex-grow grid grid-cols-4 border-0 border-t border-border-01 border-solid">
      <div className="h-full col-span-1 bg-surface-01">
        <div className="h-full flex flex-col justify-between">
          <RelayGroupList
            groups={groups}
            selectedGroupId={selectedGroupId}
            onSelectedGroupIdChange={setSelectedGroupId}
          />
          <div className="border-0 border-t border-border-01 border-solid h-12">
            <Button
              variant="link"
              className="flex items-center gap-2 h-full hover:no-underline cursor-pointer"
            >
              <FiPlus className="text-text-link" />
              <span className="text-text-link">Create new group</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="col-span-3 bg-surface-02 px-5 py-2">
        <div className="label-bold text-text-primary capitalize pb-2">
          {selectedGroupId}{' '}
          {activeGroup?.length ? `(${activeGroup?.length ?? 0})` : ''}
        </div>
        <RelayGroupTable key={selectedGroupId} group={activeGroup ?? []} />
      </div>
    </div>
  );
}
