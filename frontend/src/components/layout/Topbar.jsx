import { Menu, Bell, Wifi, WifiOff } from 'lucide-react';

/**
 * @param {{
 *   title: string,
 *   onMenuClick: Function,
 *   socketConnected?: boolean,
 * }} props
 */
export default function Topbar({ title, onMenuClick, socketConnected }) {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-700/50 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-white">{title}</h1>

        {/* Socket status badge */}
        {socketConnected !== undefined && (
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${
              socketConnected
                ? 'text-green-400 bg-green-500/10'
                : 'text-yellow-400 bg-yellow-500/10 animate-pulse'
            }`}
          >
            {socketConnected ? (
              <Wifi className="w-3 h-3" />
            ) : (
              <WifiOff className="w-3 h-3" />
            )}
            {socketConnected ? 'Live' : 'Reconnecting…'}
          </span>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <button
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
