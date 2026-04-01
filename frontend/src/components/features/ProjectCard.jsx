import { useState } from 'react';
import { Trash2, Eye, Calendar, Zap } from 'lucide-react';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import ApiKeyDisplay from './ApiKeyDisplay.jsx';
import { formatDate } from '@/utils/formatters.js';
import { deleteProject, regenerateApiKey } from '@/api/projects.api.js';
import { useProjectStore } from '@/store/projectStore.js';
import { useToast } from '@/hooks/useToast.js';

/**
 * @param {{
 *   project: object,
 *   onViewEvents: Function,
 * }} props
 */
export default function ProjectCard({ project, onViewEvents }) {
  const { removeProject, updateProject } = useProjectStore();
  const [deleting, setDeleting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const toast = useToast();

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${project.name}"? All events will be permanently deleted.`)) {
      return;
    }
    setDeleting(true);
    // Optimistic remove
    removeProject(project._id);
    try {
      await deleteProject(project._id);
      toast.success(`Project "${project.name}" deleted`);
    } catch (err) {
      // Restore on failure
      updateProject(project._id, project);
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleRegenerate = async () => {
    if (
      !window.confirm(
        'Regenerate API key? The current key will stop working immediately.'
      )
    ) {
      return;
    }
    setRegenerating(true);
    try {
      const updated = await regenerateApiKey(project._id);
      updateProject(project._id, updated);
      toast.success('API key regenerated successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <Card className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-white truncate text-base">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-slate-400 mt-0.5 line-clamp-2">{project.description}</p>
          )}
        </div>
        <span className="inline-flex items-center gap-1 text-xs bg-slate-700 border border-slate-600 text-slate-300 px-2 py-1 rounded-full flex-shrink-0 font-medium">
          <Zap className="w-3 h-3 text-indigo-400" />
          {(project.eventCount ?? 0).toLocaleString()}
        </span>
      </div>

      {/* API Key & Webhook URL */}
      <ApiKeyDisplay
        apiKey={project.apiKey}
        webhookUrl={project.webhookUrl}
        onRegenerate={handleRegenerate}
        regenerating={regenerating}
      />

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700">
        <span className="text-xs text-slate-500 flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          {formatDate(project.createdAt)}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            loading={deleting}
            title="Delete project"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewEvents(project._id)}
          >
            <Eye className="w-3.5 h-3.5" />
            Events
          </Button>
        </div>
      </div>
    </Card>
  );
}
