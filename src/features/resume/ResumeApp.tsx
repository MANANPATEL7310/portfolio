export function ResumeApp() {
  return (
    <div className="flex flex-col h-full w-full bg-gray-200 dark:bg-gray-800">
      {/* Top Toolbar - Preview Style */}
      <div className="h-12 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-4 bg-gray-100 dark:bg-gray-900 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-xs font-medium text-black/60 dark:text-white/60">Page 1 of 1</span>
          <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 overflow-hidden">
          <button className="px-2 py-1 text-xs font-medium hover:bg-black/10 dark:hover:bg-white/10 border-r border-black/5 dark:border-white/5">-</button>
          <span className="px-3 text-xs font-medium bg-transparent">100%</span>
          <button className="px-2 py-1 text-xs font-medium hover:bg-black/10 dark:hover:bg-white/10 border-l border-black/5 dark:border-white/5">+</button>
        </div>
      </div>

      {/* PDF Viewport Area */}
      <div className="flex-[1_1_0%] overflow-y-auto p-4 sm:p-8 flex justify-center h-full">
        <div className="w-full sm:w-[85%] min-w-0 sm:min-w-[380px] max-w-[500px] bg-white text-black p-6 sm:p-8 shadow-xl border border-black/10 flex flex-col gap-4 mb-4 sm:mb-8">
          <header className="border-b-2 border-black/10 pb-4 mb-2">
            <h1 className="text-3xl font-serif font-bold uppercase tracking-wide text-gray-900">John Developer</h1>
            <p className="text-[11px] text-gray-600 font-sans mt-1 uppercase tracking-wider">john@example.com | San Francisco, CA</p>
          </header>
          
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 text-gray-800 border-b border-gray-200 pb-1">Experience</h2>
            <div className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-sm text-gray-900">Senior Frontend Engineer</h3>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">2021 - Present</span>
              </div>
              <ul className="list-[square] list-inside text-xs mt-1.5 text-gray-700 space-y-1">
                <li>Spearheaded transition to Next.js resulting in 40% faster LCP.</li>
                <li>Mentored 4 junior engineers resolving performance bottlenecks.</li>
              </ul>
            </div>
            <div className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-sm text-gray-900">UI/UX Developer</h3>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">2019 - 2021</span>
              </div>
            </div>
          </section>

          <section className="mt-2">
             <h2 className="text-sm font-bold uppercase tracking-wider mb-2 text-gray-800 border-b border-gray-200 pb-1">Education</h2>
             <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-sm text-gray-900">B.S. Computer Science</h3>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">2017 - 2021</span>
              </div>
          </section>
        </div>
      </div>
    </div>
  );
}
