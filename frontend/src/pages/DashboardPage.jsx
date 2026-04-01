import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, CheckCircle, XCircle, Clock, FolderKanban } from 'lucide-react';
import StatCard from '@/components/features/StatCard.jsx';
import EventTable from '@/components/features/EventTable.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';
import Button from '@/components/ui/Button.jsx';
import { getRecentEvents, retryEvent } from '@/api/events.api.js';
import { getProjects } from '@/api/projects.api.js';
import { useEventStore } from '@/store/eventStore.js';
import { useProjectStore } from '@/store/projectStore.js';
import { useSocket } from '@/hooks/useSocket.js';
import { useToast } from '@/hooks/useToast.js';

export default function DashboardPage() {
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const { events, setEvents, updateEvent } = useEventStore();
  const { projects, setProjects } = useProjectStore();
  const { connected } = useSocket();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoadingEvents(true);
      setLoadingProjects(true);
      try {
        const [evts, projs] = await Promise.all([
          getRecentEvents(),
          getProjects(),
        ]);
        setEvents(evts);
        setProjects(projs);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoadingEvents(false);
        setLoadingProjects(false);
      }
    };
    loadData();
  }, []);

  const handleRetry = async (eventId) => {
    try {
      const { event } = await retryEvent(eventId);
      updateEvent(event);
      toast.success('Event queued for retry');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Compute stats from recent events
  const totalEvents = events.length;
  const successCount = events.filter((e) => e.status === 'success').length;
  const failedCount = events.filter((e) => e.status === 'failed').length;
  const pendingCount = events.filter(
    (e) => e.status === 'pending' || e.status === 'processing'
  ).length;
  const successRate =
    totalEvents > 0 ? Math.round((successCount / totalEvents) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Recent Events" value={totalEvents} icon={Activity} color="indigo" />
        <StatCard
          title="Success Rate"
          value={`${successRate}%`}
          icon={CheckCircle}
          color="green"
        />
        <StatCard title="Failed" value={failedCount} icon={XCircle} color="red" />
        <StatCard title="Pending" value={pendingCount} icon={Clock} color="yellow" />
      </div>

      {/* Recent Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Recent Events</h2>
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
              connected
                ? 'text-green-400 bg-green-500/10'
                : 'text-slate-400 bg-slate-700/50'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                connected ? 'bg-green-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
            {connected ? 'Live' : 'Offline'}
          </span>
        </div>
        <EventTable events={events} loading={loadingEvents} onRetry={handleRetry} />
      </div>

      {/* Projects quick access */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">
            Projects{' '}
            {!loadingProjects && (
              <span className="text-slate-500 font-normal text-sm">
                ({projects.length})
              </span>
            )}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
            View all
          </Button>
        </div>

        {loadingProjects ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-800 border border-slate-700 rounded-xl p-4 animate-pulse space-y-2"
              >
                <div className="h-4 bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to start receiving webhooks."
            action={
              <Button variant="primary" size="sm" onClick={() => navigate('/projects')}>
                Create Project
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {projects.slice(0, 4).map((p) => (
              <button
                key={p._id}
                onClick={() => navigate(`/projects/${p._id}`)}
                className="text-left bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-xl p-4 transition-colors group"
              >
                <p className="font-medium text-white truncate text-sm group-hover:text-indigo-400 transition-colors">
                  {p.name}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {(p.eventCount ?? 0).toLocaleString()} events
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
