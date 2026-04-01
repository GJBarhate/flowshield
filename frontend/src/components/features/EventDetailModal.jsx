import { RotateCcw, AlertCircle, Clock } from 'lucide-react';
import Modal from '@/components/ui/Modal.jsx';
import Badge from '@/components/ui/Badge.jsx';
import Button from '@/components/ui/Button.jsx';
import { formatDate, formatDuration, formatPayload } from '@/utils/formatters.js';

const MAX_PAYLOAD_CHARS = 10000;

const InfoRow = ({ label, value }) => (
  <div className="bg-slate-900/60 rounded-lg p-3">
    <p className="text-xs text-slate-500 mb-0.5">{label}</p>
    <p className="text-sm font-medium text-white break-all">{value}</p>
  </div>
);

/**
 * @param {{
 *   event: object|null,
 *   isOpen: boolean,
 *   onClose: Function,
 *   onRetry: Function,
 *   retrying?: boolean,
 * }} props
 */
export default function EventDetailModal({ event, isOpen, onClose, onRetry, retrying = false }) {
  if (!event) return null;

  const payloadStr = formatPayload(event.payload);
  const truncated = payloadStr.length > MAX_PAYLOAD_CHARS;
  const displayPayload = truncated ? payloadStr.slice(0, MAX_PAYLOAD_CHARS) : payloadStr;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Event Details" size="lg">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1.5">
            <p className="text-xs text-slate-500 font-mono break-all">{event._id}</p>
            <Badge status={event.status} size="md" />
          </div>
          {event.status === 'failed' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onRetry(event._id)}
              loading={retrying}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry
            </Button>
          )}
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-2">
          <InfoRow label="Received At" value={formatDate(event.receivedAt)} />
          <InfoRow label="Processed At" value={formatDate(event.processedAt)} />
          <InfoRow
            label="Duration"
            value={formatDuration(event.receivedAt, event.processedAt)}
          />
          <InfoRow label="Response Code" value={event.responseCode ?? '—'} />
          <InfoRow label="Retry Count" value={`${event.retryCount ?? 0} / ${event.maxRetries ?? 3}`} />
          <InfoRow label="Job ID" value={event.jobId ?? '—'} />
        </div>

        {/* Error block */}
        {event.status === 'failed' && event.error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-400 mb-1">Error Details</p>
              <p className="text-sm text-red-300/80 font-mono break-all">{event.error}</p>
            </div>
          </div>
        )}

        {/* Payload */}
        <div>
          <p className="text-sm font-semibold text-slate-300 mb-2">Payload</p>
          <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap break-all">
            {displayPayload}
          </pre>
          {truncated && (
            <p className="text-xs text-yellow-400 mt-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Payload truncated at {MAX_PAYLOAD_CHARS.toLocaleString()} characters.
            </p>
          )}
        </div>

        {/* Request headers */}
        {event.headers && Object.keys(event.headers).some((k) => event.headers[k]) && (
          <div>
            <p className="text-sm font-semibold text-slate-300 mb-2">Request Headers</p>
            <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(event.headers, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Modal>
  );
}
