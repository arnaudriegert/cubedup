interface Category {
  name: string
}

interface CategoryNavProps {
  categories: Category[]
  mode: 'jump' | 'filter'
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
}

export default function CategoryNav({
  categories,
  mode,
  selectedCategory,
  onCategorySelect,
}: CategoryNavProps) {
  const getCategoryId = (name: string) => name.replace(/\s+/g, '-').toLowerCase()

  if (mode === 'jump') {
    return (
      <div className="flex gap-2 items-center overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center pb-2 md:pb-0">
        <span className="text-slate-500 text-sm mr-2 shrink-0">Jump to:</span>
        {categories.map((category) => (
          <a
            key={category.name}
            href={`#${getCategoryId(category.name)}`}
            className="section-nav-link shrink-0"
          >
            {category.name}
          </a>
        ))}
      </div>
    )
  }

  // Filter mode
  return (
    <div className="flex gap-2 items-center overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center pb-2 md:pb-0">
      <span className="text-slate-500 text-sm mr-2 shrink-0">Filter:</span>
      <button
        onClick={() => onCategorySelect(null)}
        className={`section-nav-link shrink-0 ${selectedCategory === null ? 'section-nav-link-active' : ''}`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => onCategorySelect(category.name)}
          className={`section-nav-link shrink-0 ${selectedCategory === category.name ? 'section-nav-link-active' : ''}`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
