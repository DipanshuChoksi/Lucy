export default function NoteReader() {
  return (
    <main className="flex-1 flex flex-col lg:flex-row md:ml-64 min-h-screen relative">
      {/* Optional Global Progress Bar (Top) */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-surface-variant z-10 hidden lg:block">
        <div className="h-full bg-primary w-full origin-left scale-x-100 transition-transform duration-1000"></div>
      </div>
      {/* Left Panel: Video & Metadata (Sticky on Desktop) */}
      <section className="w-full lg:w-[40%] xl:w-[35%] bg-surface-container-lowest border-r border-outline-variant flex flex-col p-md lg:p-lg relative z-0">
        <div className="lg:sticky lg:top-lg flex flex-col gap-lg">
          {/* Video Container */}
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-surface-container border border-outline-variant shadow-[0_10px_30px_rgba(0,0,0,0.02)] relative group cursor-pointer">
            {/* Image Placeholder for Video */}
            <img alt="Video Thumbnail" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="A close-up, high-resolution shot of a modern, sleek digital interface..." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ3SsXCveuSH3mu-31m7XaTPc_qQBRxbh23lNk4eZ2sBp13IlnE0_FRr2sTZpUlL5GGtUwCtXRGsyR5Tw3WWI6lOG60NLtLrNKKNw-JB66ITXjtdpD_T6fiiJ5VdvFWLDyGYpc_5vZBWt_DV_344MThVPteA1l4Q1wCfTPLtYYn0iU_rZezZ1qcFDfuF-EbT5763tDoZdEPzR4sDdcxopa9TcA95Hw9tSxICRVlROIwJJ99TS47-07SiAu8-rNKTtDrcIMGjyzyVVq" />
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-inverse-surface/10 flex items-center justify-center group-hover:bg-inverse-surface/5 transition-colors">
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </div>
            </div>
          </div>
          {/* Video Meta */}
          <div className="space-y-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface">The Architecture of Modern Information Systems</h3>
            <div className="flex items-center gap-sm text-on-surface-variant font-label-md text-label-md">
              <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">account_circle</span> Dr. Aris Vane</span>
              <span>•</span>
              <span>45:20</span>
            </div>
            <div className="flex flex-wrap gap-xs pt-xs">
              <span className="px-2 py-1 bg-surface border border-outline-variant rounded font-label-sm text-label-sm text-secondary uppercase tracking-wider">Systems Design</span>
              <span className="px-2 py-1 bg-surface border border-outline-variant rounded font-label-sm text-label-sm text-secondary uppercase tracking-wider">Lecture</span>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-md pt-md border-t border-outline-variant">
            <button className="flex items-center gap-xs text-secondary hover:text-primary transition-colors font-label-md text-label-md">
              <span className="material-symbols-outlined text-[20px]">share</span> Share
            </button>
            <button className="flex items-center gap-xs text-secondary hover:text-primary transition-colors font-label-md text-label-md">
              <span className="material-symbols-outlined text-[20px]">bookmark_border</span> Save
            </button>
          </div>
        </div>
      </section>
      {/* Right Panel: The Notes Canvas */}
      <section className="w-full lg:w-[60%] xl:w-[65%] bg-background p-md lg:p-xl overflow-y-auto" >
        <div className="max-w-container-max mx-auto space-y-xl pb-xl">
          {/* Document Header */}
          <header className="space-y-md">
            <div className="flex items-center gap-sm text-on-surface-variant font-label-sm text-label-sm mb-md">
              <span>Generated today</span>
              <span>•</span>
              <span className="flex items-center gap-xs text-primary"><span className="material-symbols-outlined text-[14px]">auto_awesome</span> AI Summary</span>
            </div>
            <h1 className="font-display text-headline-lg-mobile md:text-display text-on-surface">Synthesis: Modern Information Architecture</h1>
          </header>
          {/* Executive Summary (Tonal Layering) */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary-container"></div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-sm flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">subject</span>
              Executive Summary
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              The lecture explores the fundamental shift from monolithic database structures to distributed, event-driven architectures. Dr. Vane emphasizes that modern systems must prioritize resilience and eventual consistency over immediate transactional integrity when operating at a global scale. The core takeaway is the necessity of decoupling services to maintain high availability.
            </p>
          </div>
          {/* Key Takeaways (Bento Grid) */}
          <div className="space-y-md">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">psychology</span>
              Key Takeaways
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {/* Card 1 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center mb-md text-secondary">
                  <span className="material-symbols-outlined text-[18px]">account_tree</span>
                </div>
                <h3 className="font-headline-md text-body-lg font-semibold text-on-surface mb-xs">Decoupling is Mandatory</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Microservices must not share databases. True decoupling requires service-specific data stores to prevent cascading failures.</p>
              </div>
              {/* Card 2 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center mb-md text-secondary">
                  <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                </div>
                <h3 className="font-headline-md text-body-lg font-semibold text-on-surface mb-xs">Eventual Consistency</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Embrace CAP theorem realities. In distributed systems, designing for eventual consistency yields better user experiences than locking.</p>
              </div>
              {/* Card 3 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-shadow md:col-span-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center mb-md text-secondary">
                  <span className="material-symbols-outlined text-[18px]">speed</span>
                </div>
                <h3 className="font-headline-md text-body-lg font-semibold text-on-surface mb-xs">The Latency Budget</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Every service call has a cost. Architectural planning must begin with a strict latency budget, dictating whether to use synchronous APIs or asynchronous event streams.</p>
              </div>
            </div>
          </div>
          <hr className="border-t border-outline-variant/50 my-lg" />
          {/* Detailed Transcript / Notes */}
          <div className="space-y-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">notes</span>
              Detailed Notes
            </h2>
            {/* Note Block 1 */}
            <div className="flex flex-col md:flex-row gap-md md:gap-lg group">
              <div className="md:w-24 shrink-0 pt-1">
                <button className="font-label-md text-label-md text-primary bg-primary-fixed/30 px-2 py-1 rounded hover:bg-primary-fixed transition-colors">
                  04:15
                </button>
              </div>
              <div className="flex-1 space-y-sm">
                <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">The Monolith Dilemma</h4>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Initial discussions focus on the traditional monolithic architecture. While easy to deploy initially, it becomes a bottleneck as team sizes grow. The shared state makes testing brittle and deployments risky. The speaker notes that "the monolith is not an anti-pattern, but it is a stage of maturity you eventually outgrow."
                </p>
              </div>
            </div>
            {/* Note Block 2 */}
            <div className="flex flex-col md:flex-row gap-md md:gap-lg group">
              <div className="md:w-24 shrink-0 pt-1">
                <button className="font-label-md text-label-md text-primary bg-primary-fixed/30 px-2 py-1 rounded hover:bg-primary-fixed transition-colors">
                  18:30
                </button>
              </div>
              <div className="flex-1 space-y-sm">
                <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Event-Driven Paradigms</h4>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  A deep dive into replacing synchronous HTTP calls with an event bus (like Kafka). This allows systems to react to state changes without tightly coupling the producer and consumer.
                </p>
                <div className="bg-surface-container border border-outline-variant p-md rounded-lg font-label-sm text-label-sm text-on-surface-variant mt-sm">
                  <strong>Reference:</strong> Look into "Choreography vs. Orchestration" patterns for managing complex sagas in this setup.
                </div>
              </div>
            </div>
            {/* Note Block 3 */}
            <div className="flex flex-col md:flex-row gap-md md:gap-lg group">
              <div className="md:w-24 shrink-0 pt-1">
                <button className="font-label-md text-label-md text-primary bg-primary-fixed/30 px-2 py-1 rounded hover:bg-primary-fixed transition-colors">
                  32:10
                </button>
              </div>
              <div className="flex-1 space-y-sm">
                <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Observability and Metrics</h4>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  You cannot fix what you cannot see. Distributed systems mandate distributed tracing. Logging is insufficient; you need correlation IDs passed through every layer to understand the lifecycle of a single request.
                </p>
              </div>
            </div>
          </div>
          {/* End of Notes Marker */}
          <div className="flex justify-center pt-xl pb-lg">
            <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
          </div>
        </div>
      </section>
    </main >
  );
}
