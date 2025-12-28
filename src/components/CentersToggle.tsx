interface CentersToggleProps {
  hideCenters: boolean
  onToggle: () => void
}

export function CentersToggle({ hideCenters, onToggle }: CentersToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed z-30 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-slate-200/50 p-2.5 cursor-pointer hover:scale-105 transition-all bottom-4 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:translate-x-0 md:right-4 md:top-1/2 md:-translate-y-1/2"
      aria-label={hideCenters ? 'Show slot centers' : 'Hide slot centers'}
      title={hideCenters ? 'Show slot centers' : 'Hide slot centers'}
    >
      <div className="grid grid-cols-3 gap-1">
        <span />
        <span className={`size-4 md:size-5 rounded-full transition-all ${hideCenters ? 'bg-slate-300 scale-75' : 'bg-green-500'}`} />
        <span />
        <span className={`size-4 md:size-5 rounded-full transition-all ${hideCenters ? 'bg-slate-300 scale-75' : 'bg-orange-500'}`} />
        <span />
        <span className={`size-4 md:size-5 rounded-full transition-all ${hideCenters ? 'bg-slate-300 scale-75' : 'bg-red-500'}`} />
        <span />
        <span className={`size-4 md:size-5 rounded-full transition-all ${hideCenters ? 'bg-slate-300 scale-75' : 'bg-blue-500'}`} />
        <span />
      </div>
    </button>
  )
}
