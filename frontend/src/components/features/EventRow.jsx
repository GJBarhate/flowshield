import { RotateCcw } from 'lucide-react';
import Badge from '@/components/ui/Badge.jsx';
import { formatRelativeTime, truncateId } from '@/utils/formatters.js';

/**
 * @param {{
 *   event: object,
 *   onRetry: Function,
 *   onClick: Function,
 * }} props
 */
export default function EventRow({ event, onRetry, onClick }) {
  const handleRetryClick = (e) => {
    e.stopPropagation();
    if (window.confirm('Retry this failed event?')) {
      onRetry(event._id);
    }
  };

  return (
    <tr
      onClick={() => onClick(event)}
      className="border-b border-slate-700/50 hover:bg-slate-800/80 cursor-pointer transition-colors group"
    >
      {/* Status */}
      <td className="px-4 py-3 whitespace-nowrap">
        <Badge status={event.status} />
      </td>

      {/* Event ID */}
      <td className="px-4 py-3">
        <code className="font-mono text-xs text-slate-300 group-hover:text-white transition-colors">
          {truncateId(event._id)}
        </code>
      </td>

      {/* Received At */}
      <td className="px-4 py-3 text-sm text-slate-400 whitespace-nowrap">
        {formatRelativeTime(event.receivedAt)}
      </td>

      {/* Processed At — hidden on mobile */}
      <td className="hidden md:table-cell px-4 py-3 text-sm text-slate-400 whitespace-nowrap">
        {formatRelativeTime(event.processedAt)}
      </td>

      {/* Response Code — hidden on mobile */}
      <td className="hidden md:table-cell px-4 py-3 text-sm text-slate-400 tabular-nums">
        {event.responseCode ?? '—'}
      </td>

      {/* Actions */}
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        {event.status === 'failed' && (
          <button
            onClick={handleRetryClick}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            Retry
          </button>
        )}
      </td>
    </tr>
  );
}
