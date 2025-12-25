import { ReactNode } from 'react'

interface CubeDisplayProps {
  children: ReactNode
  size?: 'normal' | 'large'
  className?: string
}

const PADDING = {
  normal: 'p-4',
  large: 'p-6',
}

/**
 * Dark background wrapper for Cube components.
 * Provides consistent styling across Playground, Cross, F2L pages.
 */
export default function CubeDisplay({
  children,
  size = 'normal',
  className = '',
}: CubeDisplayProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-transparent to-blue-500/10 rounded-3xl blur-xl" />
      <div className={`relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl ${PADDING[size]} shadow-2xl border border-gray-700/50`}>
        <div className="absolute inset-2 bg-linear-to-t from-transparent via-white/5 to-white/10 rounded-xl pointer-events-none" />
        {children}
      </div>
    </div>
  )
}
