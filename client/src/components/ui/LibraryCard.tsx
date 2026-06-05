export type LibraryCardProps = {
  status?: 'completed' | 'processing';
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  duration?: string;
  tags?: string[];
  dateAdded?: string;
  progress?: number; // 0-100 for processing state
};

export const LibraryCard: React.FC<LibraryCardProps> = ({
  status = 'completed',
  title,
  description,
  imageUrl,
  imageAlt = "thumbnail",
  duration,
  tags = [],
  dateAdded,
  progress = 66
}) => {
  if (status === 'processing') {
    return (
      <article className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden relative flex flex-col opacity-80">
        <div className="absolute top-0 left-0 w-full h-1 bg-surface-variant">
          <div className="h-full bg-primary animate-pulse" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="aspect-video relative overflow-hidden bg-surface-dim flex items-center justify-center">
          <span className="material-symbols-outlined text-outline text-4xl animate-pulse">sync</span>
        </div>
        <div className="p-md flex flex-col flex-1 justify-center items-center text-center">
          <h3 className="font-headline-md text-headline-md mb-2 text-on-surface-variant">Synthesizing...</h3>
          <p className="font-body-md text-body-md text-secondary">{title}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group cursor-pointer flex flex-col">
      <div className="aspect-video relative overflow-hidden bg-surface-container">
        {imageUrl && (
          <img
            alt={imageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={imageUrl}
          />
        )}
        {duration && (
          <div className="absolute bottom-2 right-2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded opacity-90">
            {duration}
          </div>
        )}
      </div>
      <div className="p-md flex flex-col flex-1 min-w-0">
        {tags.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {tags.map((tag, idx) => (
              <span key={idx} className="bg-surface-container px-2 py-1 rounded font-label-sm text-label-sm text-secondary">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-headline-md text-headline-md mb-2 line-clamp-2">{title}</h3>
        {description && (
          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4 flex-1">
            {description}
          </p>
        )}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-outline-variant border-opacity-30">
          <span className="font-label-sm text-label-sm text-secondary">{dateAdded ? `Added ${dateAdded}` : ''}</span>
          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_forward</span>
        </div>
      </div>
    </article>
  );
};
