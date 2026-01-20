import React from 'react';
import { NEWS_CATEGORIES } from '../constants/countries';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    ...Object.entries(NEWS_CATEGORIES).map(([key, label]) => ({
      value: key,
      label
    }))
  ];

  return (
    <div className="category-filter">
      <label htmlFor="category-select" className="filter-label">
        Filter by Category:
      </label>
      <select
        id="category-select"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="category-select"
      >
        {categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;