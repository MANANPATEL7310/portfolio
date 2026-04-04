export function TrafficLights({
  onClose,
  onMinimize,
  onMaximize
}: {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}) {
  return (
    <div className="flex items-center gap-[6px]">
      <button onClick={onClose} className="h-3 w-3 rounded-full bg-[var(--color-mac-red)] border border-black/10 shadow-inner hover:bg-red-500 transition-colors cursor-pointer" aria-label="Close" />
      <button onClick={onMinimize} className="h-3 w-3 rounded-full bg-[var(--color-mac-yellow)] border border-black/10 shadow-inner hover:bg-yellow-400 transition-colors cursor-pointer" aria-label="Minimize" />
      <button onClick={onMaximize} className="h-3 w-3 rounded-full bg-[var(--color-mac-green)] border border-black/10 shadow-inner hover:bg-green-500 transition-colors cursor-pointer" aria-label="Maximize" />
    </div>
  );
}
