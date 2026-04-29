import React from 'react';
import { cn } from '../../lib/utils';
import type { EzFlowToolboxProps, EzFlowNodeLibraryCategory } from './EzFlow.types';
import { ChevronDown, ChevronRight, GripVertical, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '../ui/button';

const CategorySection = ({
  category,
  isExpanded,
  onToggle,
  onNodeActivate,
}: {
  category: EzFlowNodeLibraryCategory;
  isExpanded: boolean;
  onToggle: () => void;
  onNodeActivate?: EzFlowToolboxProps['onNodeActivate'];
}) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    // Add plain text fallback for broader compatibility
    event.dataTransfer.setData('text/plain', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="mb-2">
      {/* Category Header */}
      <button
        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:bg-muted/30 transition-colors"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-label={`Toggle ${category.categoryKey} section`}
      >
        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {category.categoryKey}
      </button>

      {/* Items */}
      {isExpanded && (
        <div className="flex flex-col gap-1.5 mt-1 px-1">
          {category.items.map((item) => (
            <div
              key={item.type}
              className="group relative flex items-center gap-3 p-3 rounded-xl bg-background/30 border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all cursor-grab active:cursor-grabbing"
              onDragStart={(event) => onDragStart(event, item.type)}
              onDoubleClick={() => onNodeActivate?.(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onNodeActivate?.(item);
                }
              }}
              draggable
              role="button"
              tabIndex={0}
              aria-label={`Drag ${item.labelKey} node`}
              data-ezflow-node-type={item.type}
            >
              <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity">
                <GripVertical size={12} />
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform ml-2">
                {item.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold leading-none mb-0.5 truncate">
                  {item.labelKey}
                </span>
                {item.descriptionKey && (
                  <span className="text-[10px] text-muted-foreground leading-tight line-clamp-1">
                    {item.descriptionKey}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const EzFlowToolbox = ({
  categories,
  title = 'Node Library',
  className,
  collapsed = false,
  onCollapsedChange,
  onNodeActivate,
}: EzFlowToolboxProps) => {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(categories.map((c) => c.category))
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  if (collapsed) {
    return (
      <aside
        className={cn('p-2 border-r border-border bg-card/30 backdrop-blur-md flex flex-col items-center', className)}
        aria-label="Node Library (collapsed)"
      >
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl mb-2"
          onClick={() => onCollapsedChange?.(false)}
          aria-label="Expand node library"
        >
          <PanelLeft size={16} />
        </Button>
        {categories.flatMap((c) =>
          c.items.map((item) => (
            <div
              key={item.type}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary/10 cursor-grab active:cursor-grabbing transition-colors mb-1"
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', item.type);
                event.dataTransfer.setData('text/plain', item.type);
                event.dataTransfer.effectAllowed = 'move';
              }}
              onDoubleClick={() => onNodeActivate?.(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onNodeActivate?.(item);
                }
              }}
              draggable
              title={item.labelKey}
              role="button"
              tabIndex={0}
              aria-label={`Drag ${item.labelKey} node`}
              data-ezflow-node-type={item.type}
            >
              {item.icon}
            </div>
          ))
        )}
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        'w-72 p-4 border-r border-border bg-card/30 backdrop-blur-md flex flex-col gap-2 overflow-y-auto',
        className
      )}
      aria-label="Node Library"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase font-black tracking-widest text-primary/60 px-1">
          {title}
        </div>
        {onCollapsedChange && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl w-7 h-7"
            onClick={() => onCollapsedChange(true)}
            aria-label="Collapse node library"
          >
            <PanelLeftClose size={14} />
          </Button>
        )}
      </div>

      {categories.map((category) => (
        <CategorySection
          key={category.category}
          category={category}
          isExpanded={expandedCategories.has(category.category)}
          onToggle={() => toggleCategory(category.category)}
          onNodeActivate={onNodeActivate}
        />
      ))}
    </aside>
  );
};

EzFlowToolbox.displayName = 'EzFlowToolbox';
