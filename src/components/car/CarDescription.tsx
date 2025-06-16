'use client'

interface CarDescriptionProps {
  description: string
  tags: string[]
}

export function CarDescription({ description, tags }: CarDescriptionProps) {
  return (
    <>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3 flex items-center">
          <div className="w-1 h-6 bg-teal-400 mr-3 rounded-full"></div>
          About This Car
        </h2>
        <p className="text-zinc-300 leading-relaxed">{description ?? 'No description available'}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <div className="w-1 h-6 bg-teal-400 mr-3 rounded-full"></div>
          Features
        </h2>
        <div className="flex flex-wrap gap-2">
          {(tags ?? []).map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 bg-zinc-800 border border-zinc-700/50 hover:border-teal-500/40 rounded-full text-sm font-medium text-white transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>
    </>
  )
}
