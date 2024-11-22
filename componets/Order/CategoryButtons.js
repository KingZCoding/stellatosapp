'use client';

export default function CategoryButtons({
  categories,
  selectedCategory,
  onCategorySelect,
}) {
  return (
    <div className="category-buttons">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-button ${
            selectedCategory === category ? 'active' : ''
          }`}
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </button>
      ))}
      <button
        className={`category-button ${selectedCategory === '' ? 'active' : ''}`}
        onClick={() => onCategorySelect('')}
      >
        All Products
      </button>
    </div>
  );
}
