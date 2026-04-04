export function AboutApp() {
  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-white/90 dark:bg-black/60 backdrop-blur-md">
      {/* Sidebar - Finder Style */}
      <div className="w-full md:w-[180px] md:min-w-[180px] border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 pt-4 md:pt-6 px-3 flex flex-row md:flex-col gap-2 md:gap-4 bg-gray-50/50 dark:bg-black/50 overflow-x-auto shrink-0 hide-scrollbar">
        <h3 className="hidden md:block text-[10px] font-bold text-black/50 dark:text-white/50 uppercase tracking-widest px-2">Favorites</h3>
        <nav className="flex flex-row md:flex-col gap-1 text-sm font-medium">
          <div className="flex items-center gap-2 px-2 py-1.5 bg-blue-500 text-white rounded-md cursor-pointer shadow-sm shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span className="hidden sm:inline">General</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 rounded-md cursor-pointer shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            <span className="hidden sm:inline">Hobbies</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 rounded-md cursor-pointer shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span className="hidden sm:inline">Experience</span>
          </div>
        </nav>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-[1_1_0%] p-6 md:p-8 overflow-y-auto">
        <div className="flex flex-col gap-6 max-w-lg mx-auto md:mx-0">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 shadow-inner flex items-center justify-center overflow-hidden border-2 border-white/50">
               <img src="/assets/Contact Picture.png" alt="Avatar" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = '/assets/App Icon-1.png'} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white mb-1">Developer Name</h1>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Software Engineer & Designer</p>
            </div>
          </div>
          
          {/* Content Row */}
          <div className="text-sm text-black/80 dark:text-white/80 leading-relaxed space-y-4">
            <p>Welcome to my generic macOS-inspired portfolio! I build beautiful, highly interactive web experiences tailored for modern audiences.</p>
            <p>This UI shell provides a simulated desktop experience wrapped inside a single-page React app, fully powered by Zustand window mechanics and Framer Motion physics constraints.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
