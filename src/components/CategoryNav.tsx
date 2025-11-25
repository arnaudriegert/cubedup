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
      <div className="flex flex-wrap gap-2 justify-center items-center">
        <span className="text-slate-500 text-sm mr-2">Jump to:</span>
        {categories.map((category) => (
          <a
            key={category.name}
            href={`#${getCategoryId(category.name)}`}
            className="section-nav-link"
          >
            {category.name}
          </a>
        ))}
      </div>
    )
  }

  // Filter mode
  return (
    <div className="flex flex-wrap gap-2 justify-center items-center">
      <span className="text-slate-500 text-sm mr-2">Filter:</span>
      <button
        onClick={() => onCategorySelect(null)}
        className={`section-nav-link ${selectedCategory === null ? 'section-nav-link-active' : ''}`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => onCategorySelect(category.name)}
          className={`section-nav-link ${selectedCategory === category.name ? 'section-nav-link-active' : ''}`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
