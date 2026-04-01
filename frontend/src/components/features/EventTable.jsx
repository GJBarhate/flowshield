import { useState } from 'react';
import { Webhook } from 'lucide-react';
import EventRow from './EventRow.jsx';
import EventDetailModal from './EventDetailModal.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';
import Button from '@/components/ui/Button.jsx';
import SkeletonRow from '@/components/ui/SkeletonRow.jsx';

/**
 * @param {{
 *   events: Array,
 *   loading: boolean,
 *   onRetry: Function,
 *   hasMore?: boolean,
 *   onLoadMore?: Function,
 *   loadingMore?: boolean,
 * }} props
 */
export default function EventTable({
  events,
  loading,
  onRetry,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
}) {
  const [selected, setSelected] = useState(null);
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async (eventId) => {
    setRetrying(true);
    try {
      await onRetry(eventId);
    } finally {
      setRetrying(false);
      setSelected(null);
    }
  };

  const columns = [
    { label: 'Status', hidden: '' },
    { label: 'Event ID', hidden: '' },
    { label: 'Received', hidden: '' },
    { label: 'Processed', hidden: 'hidden md:table-cell' },
    { label: 'Code', hidden: 'hidden md:table-cell' },
    { label: 'Actions', hidden: '' },
  ];

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/60">
              {columns.map(({ label, hidden }) => (
                <th
                  key={label}
                  className={`px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider ${hidden}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700/20">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonRow key={i} cols={6} />
                ))
              : events.map((event) => (
                  <EventRow
                    key={event._id}
                    event={event}
                    onRetry={handleRetry}
                    onClick={setSelected}
                  />
                ))}
          </tbody>
        </table>

        {!loading && events.length === 0 && (
          <EmptyState
            icon={Webhook}
            title="No events yet"
            description="Webhook events will appear here once your endpoint starts receiving requests."
          />
        )}
      </div>

      {hasMore && !loading && (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" onClick={onLoadMore} loading={loadingMore}>
            Load more events
          </Button>
        </div>
      )}

      <EventDetailModal
        event={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        onRetry={handleRetry}
        retrying={retrying}
      />
    </>
  );
}
