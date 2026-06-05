import { LibraryCard, LibraryCardProps } from '../../components/ui/LibraryCard';

const LIBRARY_ITEMS: LibraryCardProps[] = [
  {
    title: "The Future of Embodied Intelligence in Autonomous Systems",
    description: "A comprehensive breakdown of how LLMs are being integrated into physical robotic frameworks to improve spatial awareness and dynamic problem solving in unpredictable environments.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIPEL5en9PXFmfn1pETxU2Ix7Wg4ZTBdLI76HJ92f2afCPNOt76NrB-4sjLNaDMm6sZByA4nYpvLe4zhkDI-LWrMqxQetQroZVuwy-HOMBeLdoPU4xLW6EUmGYL-Pk0Ddt0MyIRP35b_XLoa-GoQFa4U67VwAdKyBY1tsKG_gB2Ss2p1wHvGXj83rwaCc70rgEjtfrhe8GpVSTJA7kZv5wnTXSeujH-Wk-M-oDcAQzGt7ib1p2YdAmmd6KLjvw0ygLPhSlRaKMkHhI",
    imageAlt: "Robotics presentation",
    duration: "14:20",
    tags: ["AI & Robotics", "Lecture"],
    dateAdded: "Oct 12",
  },
  {
    title: "Neuroplasticity and Habit Formation: A Clinical View",
    description: "Detailed analysis of dopamine pathways during the initial 30 days of routine building. Explores the physical changes in grey matter density related to conscious repetition.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDatdPY_HAfM2PQ_snp0Oy7FXlHBGO0hum7RMdcwWQGcagQiae4HvSiH7Xj-oIxGECQc7VRkoqzv2rAD5jQlpCkr6hQWeCseJEoMaomz6e2x9zeWWTQIIC_Pv7TECZHNsk9yXe7sgT9V1g3HnLH_FoMjutOzOJJRiKh5LfAGgCNe_0beGVTTdMWp92R70t1XZyjGQp9JsBnffuZAPPRzDLyO1Y4SwKxFsAOx-6524IOdegj6Nw4byyNk-BDX_RgwkOZ3g4YFIBIaHY",
    imageAlt: "Neuroscience scan",
    duration: "45:10",
    tags: ["Neuroscience"],
    dateAdded: "Oct 10",
  },
  {
    title: "Negative Space in Modern Japanese Architecture",
    description: "An exploration of 'Ma' (the concept of negative space) and its application in contemporary urban dwelling designs to reduce cognitive load and promote tranquility.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBU4jRY_TA_A1HOTpDBdS7do0ghQ6EuUYmIsc2qJdEODd5A4ydk4Fi5raWg9llreQrfWokDbR0z5DAauzRrsj9JWqi0jwrGri-hFFB0FXMT-NnjI5spBkEbHo9Qh62tEuFeL6o8VfmLEZjFPTY4fSHtteyrdGkjdqEDMiOeyKuQK5I9b75deR0SDnONKTYpPGrHys3L6HoEvVFaKKhZz6Ux4-GxFlUz9BQdggdLH4uwjZQNsEsQsxfQ6clllMDBWMbNG_58LYnaYcVL",
    imageAlt: "Minimalist architecture",
    duration: "18:05",
    tags: ["Design Theory", "Architecture"],
    dateAdded: "Oct 08",
  },
  {
    title: "Advanced Quantum Mechanics Lecture",
    status: "processing",
  }
];

export default function NotesLibrary() {
  return (
    <main className="flex-1 md:ml-64 w-full">
      {/* Dashboard Header Area */}
      <div className="max-w-container-max mx-auto px-md md:px-lg py-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg hidden md:block">My Library</h2>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:hidden">My Library</h2>
            <p className="font-body-md text-body-md text-secondary mt-2">12 saved video syntheses</p>
          </div>
          {/* Search and Filter */}
          <div className="flex w-full md:w-auto gap-sm relative">
            <div className="relative flex-1 md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border-b border-outline-variant focus:border-primary focus:outline-none focus:ring-0 font-body-md text-body-md transition-colors placeholder:text-outline-variant" placeholder="Search notes..." type="text" />
            </div>
            <button className="flex items-center justify-center p-2 border border-outline-variant rounded hover:bg-surface-container-lowest transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
            </button>
          </div>
        </div>
        {/* Library Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md md:gap-lg">
          {LIBRARY_ITEMS.map((item, index) => (
            <LibraryCard key={index} {...item} />
          ))}
        </div>
      </div>
      {/* Footer */}
      <footer className="mt-auto border-t border-outline-variant dark:border-outline py-xl bg-background dark:bg-background">
        <div className="max-w-container-max mx-auto px-lg flex flex-col md:flex-row justify-between items-center gap-md">
          <span className="font-display text-label-md font-bold text-on-surface">Lucy</span>
          <p className="font-label-sm text-label-sm text-secondary dark:text-secondary-fixed-dim">© 2024 Lucy AI. Designed for productive calm.</p>
          <div className="flex gap-md">
            <a className="font-label-sm text-label-sm text-on-secondary-container dark:text-secondary-fixed-dim hover:text-primary hover:underline transition-all opacity-100 hover:opacity-80" href="#">Privacy</a>
            <a className="font-label-sm text-label-sm text-on-secondary-container dark:text-secondary-fixed-dim hover:text-primary hover:underline transition-all opacity-100 hover:opacity-80" href="#">Terms</a>
            <a className="font-label-sm text-label-sm text-on-secondary-container dark:text-secondary-fixed-dim hover:text-primary hover:underline transition-all opacity-100 hover:opacity-80" href="#">Support</a>
          </div>
        </div>
      </footer>
    </main>
  );
}