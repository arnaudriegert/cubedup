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
  const isJump = mode === 'jump'

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (isJump) {
      if (value) {
        document.getElementById(value)?.scrollIntoView({ behavior: 'smooth' })
        e.target.value = '' // Reset to show placeholder again
      }
    } else {
      onCategorySelect(value === '' ? null : value)
    }
  }

  return (
    <>
      {/* Mobile: dropdown */}
      <select
        value={isJump ? undefined : (selectedCategory ?? '')}
        defaultValue={isJump ? '' : undefined}
        onChange={handleSelectChange}
        className="md:hidden w-full form-select"
      >
        <option value="" disabled={isJump}>
          {isJump ? 'Jump to...' : 'All categories'}
        </option>
        {categories.map((category) => (
          <option
            key={category.name}
            value={isJump ? getCategoryId(category.name) : category.name}
          >
            {category.name}
          </option>
        ))}
      </select>

      {/* Desktop: horizontal nav */}
      <div className="hidden md:flex gap-2 items-center flex-wrap justify-center">
        <span className="text-slate-500 text-sm mr-2 shrink-0">
          {isJump ? 'Jump to:' : 'Filter:'}
        </span>
        {!isJump && (
          <button
            onClick={() => onCategorySelect(null)}
            className={`section-nav-link shrink-0 ${selectedCategory === null ? 'section-nav-link-active' : ''}`}
          >
            All
          </button>
        )}
        {categories.map((category) =>
          isJump ? (
            <a
              key={category.name}
              href={`#${getCategoryId(category.name)}`}
              className="section-nav-link shrink-0"
            >
              {category.name}
            </a>
          ) : (
            <button
              key={category.name}
              onClick={() => onCategorySelect(category.name)}
              className={`section-nav-link shrink-0 ${selectedCategory === category.name ? 'section-nav-link-active' : ''}`}
            >
              {category.name}
            </button>
          ))}
      </div>
    </>
  )
}
