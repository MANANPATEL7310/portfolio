const MOCK_PROJECTS = [
  { id: 1, title: 'E-Commerce Platform', img: '/assets/Image-1.png' },
  { id: 2, title: 'SaaS Dashboard', img: '/assets/Image-2.png' },
  { id: 3, title: 'Mobile Social App', img: '/assets/Image-3.png' },
  { id: 4, title: 'AI Chatbot', img: '/assets/Image-4.png' }
];

export function ProjectsApp() {
  return (
    <div className="flex flex-col h-full w-full bg-white/90 dark:bg-black/60 backdrop-blur-md">
      {/* Top Toolbar - Photos Style */}
      <div className="h-14 border-b border-black/10 dark:border-white/10 flex items-center justify-center gap-3 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-md">
        <button className="px-4 py-1 text-[13px] font-semibold bg-white dark:bg-gray-700 rounded-md shadow-sm border border-black/10 dark:border-white/10">All App</button>
        <button className="px-4 py-1 text-[13px] font-medium text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">Web Tools</button>
        <button className="px-4 py-1 text-[13px] font-medium text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">Mobile iOS</button>
      </div>

      {/* Grid Content */}
      <div className="flex-[1_1_0%] overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-4">
          {MOCK_PROJECTS.map((proj) => (
            <div key={proj.id} className="group cursor-pointer flex flex-col gap-2">
              <div className="aspect-[4/3] w-full rounded-xl bg-gray-200 dark:bg-gray-800 overflow-hidden shadow-sm border border-black/10 dark:border-white/10 transition-transform group-hover:scale-[1.03]">
                <img src={proj.img} alt={proj.title} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = '/assets/Desktop Wallpaper.png'} />
              </div>
              <p className="text-xs font-semibold text-center text-black/90 dark:text-white/90">{proj.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
