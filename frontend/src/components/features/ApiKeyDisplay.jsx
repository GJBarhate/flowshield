import { useState } from 'react';
import { Eye, EyeOff, Copy, Check, RefreshCw, Link } from 'lucide-react';
import Button from '@/components/ui/Button.jsx';
import { useToast } from '@/hooks/useToast.js';

/**
 * @param {{
 *   apiKey: string,
 *   webhookUrl: string,
 *   onRegenerate: Function,
 *   regenerating?: boolean,
 * }} props
 */
export default function ApiKeyDisplay({ apiKey, webhookUrl, onRegenerate, regenerating = false }) {
  const [revealed, setRevealed] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const toast = useToast();

  const copyToClipboard = async (text, setCopied) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure contexts
        const el = document.createElement('textarea');
        el.value = text;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy — please copy manually.');
    }
  };

  const masked = apiKey
    ? `${apiKey.slice(0, 14)}••••••••••••••••`
    : '—';

  return (
    <div className="space-y-4">
      {/* API Key row */}
      <div>
        <label className="text-xs font-medium text-slate-400 mb-1.5 block uppercase tracking-wide">
          API Key
        </label>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-300 truncate min-w-0">
            {revealed ? apiKey : masked}
          </code>
          <button
            onClick={() => setRevealed(!revealed)}
            title={revealed ? 'Hide key' : 'Reveal key'}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => copyToClipboard(apiKey, setCopiedKey)}
            title="Copy API key"
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            {copiedKey ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Webhook URL row */}
      <div>
        <label className="text-xs font-medium text-slate-400 mb-1.5 block uppercase tracking-wide">
          Webhook URL
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 min-w-0">
            <Link className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <code className="text-xs font-mono text-slate-300 truncate">{webhookUrl}</code>
          </div>
          <button
            onClick={() => copyToClipboard(webhookUrl, setCopiedUrl)}
            title="Copy webhook URL"
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            {copiedUrl ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Regenerate */}
      <div className="pt-1">
        <Button
          variant="danger"
          size="sm"
          onClick={onRegenerate}
          loading={regenerating}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate API Key
        </Button>
        <p className="text-xs text-slate-500 mt-1.5">
          Warning: regenerating will immediately invalidate the current key.
        </p>
      </div>
    </div>
  );
}
