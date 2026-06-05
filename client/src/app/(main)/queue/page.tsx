export default function ProcessingQueue() {
  return (
    <main className="flex-1 md:ml-64 w-full">
      <div className="max-w-container-max mx-auto px-md sm:px-xl py-lg sm:py-xl overflow-x-hidden">
        {/* Page Header */}
        <header className="mb-xl flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Processing Queue</h2>
            <p className="font-body-md text-body-md text-secondary">Transforming video content into structured knowledge.</p>
          </div>
          <div className="flex items-center gap-xs font-label-sm text-label-sm text-primary bg-primary-fixed-dim/20 px-sm py-xs rounded-full">
            <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
            <span>3 Active Tasks</span>
          </div>
        </header>

        {/* Queue List */}
        <div className="flex flex-col gap-md">
          {/* Card 1 */}
          <div className="bg-surface border border-outline-variant rounded-xl p-md flex flex-col gap-md shadow-none hover:bg-surface-container-lowest transition-colors relative group">
            <div className="flex justify-between items-start gap-lg">
              <div className="flex-1 min-w-0">
                <h3 className="font-headline-md text-headline-md text-on-surface truncate">The Economics of Artificial Intelligence</h3>
                <div className="flex items-center gap-sm mt-xs">
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded uppercase tracking-wider">Economics</span>
                  <span className="font-body-md text-label-sm text-secondary">Added 2 mins ago</span>
                </div>
              </div>
              <div className="w-16 h-12 bg-surface-container-low border border-outline-variant rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                <span className="material-symbols-outlined text-secondary text-[24px] z-10">smart_display</span>
                <div className="absolute inset-0 bg-gradient-to-br from-surface-variant to-transparent opacity-50"></div>
              </div>
            </div>
            {/* Minimalist Status Stepper */}
            <div className="flex items-center gap-sm mt-sm flex-wrap">
              <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>Extracted</span>
              </div>
              <div className="w-6 h-[1px] bg-outline-variant"></div>
              <div className="flex items-center gap-xs font-label-sm text-label-sm text-primary">
                <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                <span className="font-bold">Transcribing</span>
              </div>
              <div className="w-6 h-[1px] bg-outline-variant/30"></div>
              <div className="flex items-center gap-xs font-label-sm text-label-sm text-outline">
                <span className="material-symbols-outlined text-[14px]">radio_button_unchecked</span>
                <span>Summarizing</span>
              </div>
              <div className="w-6 h-[1px] bg-outline-variant/30"></div>
              <div className="flex items-center gap-xs font-label-sm text-label-sm text-outline">
                <span className="material-symbols-outlined text-[14px]">cloud_upload</span>
                <span>S3 Storage</span>
              </div>
            </div>
            {/* Progress Bar (Thin, Indigo) */}
            <div className="w-full bg-surface-container-high h-unit rounded-full mt-xs overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out w-[35%] relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 animate-subtle-pulse"></div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface border border-outline-variant rounded-xl p-md flex flex-col gap-md shadow-none hover:bg-surface-container-lowest transition-colors relative group">
            <div className="flex justify-between items-start gap-lg">
              <div className="flex-1 min-w-0">
                <h3 className="font-headline-md text-headline-md text-on-surface truncate">Stanford Seminar: LLM Architecture Deep Dive</h3>
                <div className="flex items-center gap-sm mt-xs">
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded uppercase tracking-wider">Computer Science</span>
                  <span className="font-body-md text-label-sm text-secondary">Added 15 mins ago</span>
                </div>
              </div>
              <div className="w-16 h-12 bg-surface-container-low border border-outline-variant rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                <span className="material-symbols-outlined text-secondary text-[24px] z-10">smart_display</span>
                <div className="absolute inset-0 bg-gradient-to-br from-surface-variant to-transparent opacity-50"></div>
              </div>
            </div>
            {/* Minimalist Status Stepper */}
            <div className="flex items-center gap-sm mt-sm flex-wrap">
              <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>Extracted</span>
              </div>
              <div className="w-6 h-[1px] bg-outline-variant"></div>
              <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>Transcribed</span>
              </div>
              <div className="w-6 h-[1px] bg-outline-variant"></div>
              <div className="flex items-center gap-xs font-label-sm text-label-sm text-primary">
                <span className="material-symbols-outlined text-[14px] animate-spin">data_usage</span>
                <span className="font-bold">Summarizing</span>
              </div>
              <div className="w-6 h-[1px] bg-outline-variant/30"></div>
              <div className="flex items-center gap-xs font-label-sm text-label-sm text-outline">
                <span className="material-symbols-outlined text-[14px]">cloud_upload</span>
                <span>S3 Storage</span>
              </div>
            </div>
            {/* Progress Bar (Thin, Indigo) */}
            <div className="w-full bg-surface-container-high h-unit rounded-full mt-xs overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out w-[68%] relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 animate-subtle-pulse"></div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface border border-outline-variant rounded-xl p-md flex flex-col gap-md shadow-none hover:bg-surface-container-lowest transition-colors relative group">
            <div className="flex justify-between items-start gap-lg">
              <div className="flex-1 min-w-0">
                <h3 className="font-headline-md text-headline-md text-on-surface truncate">Huberman Lab: Optimizing Deep Work &amp; Focus</h3>
                <div className="flex items-center gap-sm mt-xs">
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded uppercase tracking-wider">Neuroscience</span>
                  <span className="font-body-md text-label-sm text-secondary">Added 45 mins ago</span>
                </div>
              </div>
              <div className="w-16 h-12 bg-surface-container-low border border-outline-variant rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                <span className="material-symbols-outlined text-secondary text-[24px] z-10">smart_display</span>
                <div className="absolute inset-0 bg-gradient-to-br from-surface-variant to-transparent opacity-50"></div>
              </div>
            </div>
            {/* Minimalist Status Stepper */}
            <div className="flex items-center gap-sm mt-sm flex-wrap">
              <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>Extracted</span>
              </div>
              <div className="w-6 h-[1px] bg-outline-variant"></div>
              <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>Transcribed</span>
              </div>
              <div className="w-6 h-[1px] bg-outline-variant"></div>
              <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>Summarized</span>
              </div>
              <div className="w-6 h-[1px] bg-outline-variant"></div>
              <div className="flex items-center gap-xs font-label-sm text-label-sm text-primary">
                <span className="material-symbols-outlined text-[14px] animate-bounce">cloud_upload</span>
                <span className="font-bold">Storing in S3</span>
              </div>
            </div>
            {/* Progress Bar (Thin, Indigo) */}
            <div className="w-full bg-surface-container-high h-unit rounded-full mt-xs overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out w-[95%] relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 animate-subtle-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Contextual Footer */}
        <div className="mt-xl text-center font-label-sm text-label-sm text-outline">
          <p>Processing times vary based on video length and current server load.</p>
        </div>
      </div>
    </main>
  );
}
