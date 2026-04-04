import { MenuBar } from './MenuBar';
import { Dock } from './Dock';

export function Desktop() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900 text-foreground selection:bg-blue-500 selection:text-white">
      {/* Background Wallpaper */}
      <img 
        src="/assets/Desktop Wallpaper.png" 
        alt="macOS Wallpaper" 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" 
      />
      
      {/* Frame Elements */}
      <MenuBar />
      
      {/* Future Window Manager Layer */}
      <div className="relative z-10 w-full h-full pt-7 pb-20 pointer-events-none">
         {/* Windows will be injected here */}
      </div>

      <Dock />
    </div>
  );
}
