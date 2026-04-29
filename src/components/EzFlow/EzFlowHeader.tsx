import React from 'react';
import { cn } from '../../lib/utils';
import type { EzFlowHeaderProps, EzFlowStatus } from './EzFlow.types';
import { Rocket, Save, X, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';

const statusConfig: Record<EzFlowStatus, { className: string; label: string }> = {
  draft: {
    className: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
    label: 'Draft',
  },
  live: {
    className: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    label: 'Live',
  },
  archived: {
    className: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
    label: 'Archived',
  },
};

export const EzFlowHeader = ({
  title,
  description,
  status = 'draft',
  isDirty = false,
  onTitleChange,
  onDescriptionChange,
  onSave,
  onPublish,
  onCancel,
  showGrid = true,
  onShowGridChange,
  snapToGrid = true,
  onSnapToGridChange,
  className,
}: EzFlowHeaderProps) => {
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [isEditingDescription, setIsEditingDescription] = React.useState(false);
  const [localTitle, setLocalTitle] = React.useState(title);
  const [localDescription, setLocalDescription] = React.useState(description || '');
  const titleInputRef = React.useRef<HTMLInputElement>(null);
  const descInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  React.useEffect(() => {
    setLocalDescription(description || '');
  }, [description]);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (localTitle !== title) {
      onTitleChange?.(localTitle);
    }
  };

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    if (localDescription !== description) {
      onDescriptionChange?.(localDescription);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const discard = window.confirm(
        'You have unsaved changes. Discard and exit?'
      );
      if (!discard) return;
    }
    onCancel?.();
  };

  const sc = statusConfig[status];

  return (
    <header
      className={cn(
        'h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-xl shrink-0',
        className
      )}
      role="banner"
      aria-label="Workflow designer header"
    >
      {/* Left: Back + Metadata */}
      <div className="flex items-center gap-4 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl shrink-0"
          onClick={handleCancel}
          aria-label="Go back"
        >
          <ChevronLeft size={18} />
        </Button>

        <div className="h-6 w-px bg-border shrink-0" />

        <div className="flex flex-col min-w-0">
          {/* Title */}
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleBlur();
                if (e.key === 'Escape') {
                  setLocalTitle(title);
                  setIsEditingTitle(false);
                }
              }}
              className="text-base font-bold bg-transparent border-none outline-none ring-0 p-0 text-foreground w-full"
              autoFocus
              aria-label="Workflow title"
            />
          ) : (
            <button
              className="text-base font-bold text-left hover:text-primary transition-colors cursor-text truncate"
              onClick={() => {
                setIsEditingTitle(true);
                setTimeout(() => titleInputRef.current?.focus(), 0);
              }}
              aria-label={`Workflow title: ${localTitle}. Click to edit`}
            >
              {localTitle || 'Untitled Workflow'}
              {isDirty && (
                <span className="ml-2 text-[9px] text-muted-foreground/50 font-normal">
                  (unsaved)
                </span>
              )}
            </button>
          )}

          {/* Description */}
          {isEditingDescription ? (
            <input
              ref={descInputRef}
              value={localDescription}
              onChange={(e) => setLocalDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDescriptionBlur();
                if (e.key === 'Escape') {
                  setLocalDescription(description || '');
                  setIsEditingDescription(false);
                }
              }}
              className="text-[10px] uppercase tracking-widest text-muted-foreground bg-transparent border-none outline-none ring-0 p-0 w-full"
              autoFocus
              aria-label="Workflow description"
            />
          ) : (
            <button
              className="text-[10px] uppercase tracking-widest text-muted-foreground/50 text-left hover:text-muted-foreground transition-colors cursor-text truncate"
              onClick={() => {
                setIsEditingDescription(true);
                setTimeout(() => descInputRef.current?.focus(), 0);
              }}
              aria-label={`Description: ${localDescription || 'Click to add description'}`}
            >
              {localDescription || 'Click to add description'}
            </button>
          )}
        </div>

        {/* Status Badge */}
        <div
          className={cn(
            'shrink-0 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest',
            sc.className
          )}
          role="status"
          aria-label={`Status: ${sc.label}`}
        >
          {sc.label}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6 shrink-0">
        {/* Canvas Controls */}
        <div className="flex items-center gap-4 bg-background/40 px-4 py-1.5 rounded-2xl border border-border/10">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => onShowGridChange?.(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
            />
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground group-hover:text-foreground transition-colors">
              Grid
            </span>
          </label>
          <div className="w-px h-4 bg-border/20" />
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={snapToGrid}
              onChange={(e) => onSnapToGridChange?.(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
            />
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground group-hover:text-foreground transition-colors">
              Snap
            </span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="rounded-xl h-9 px-4 text-xs gap-2"
            onClick={handleCancel}
            aria-label="Cancel changes"
          >
            <X size={14} />
            Cancel
          </Button>
          <Button
            className="rounded-xl h-9 px-6 bg-primary text-primary-foreground gap-2 shadow-lg shadow-primary/20 text-xs font-bold"
            onClick={onSave}
            aria-label="Save workflow"
          >
            <Save size={14} />
            Save
          </Button>
          {onPublish && (
            <Button
              variant="secondary"
              className="rounded-xl h-9 px-4 text-xs gap-2 font-bold"
              onClick={onPublish}
              aria-label="Publish workflow"
            >
              <Rocket size={14} />
              Publish
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

EzFlowHeader.displayName = 'EzFlowHeader';
