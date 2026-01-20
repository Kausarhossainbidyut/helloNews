import React, { useState, useEffect, useCallback } from 'react';
import { COUNTRIES } from './constants/countries';
import { newsService } from './services/newsService';
import CountryCard from './components/CountryCard';
import NewsCard from './components/NewsCard';
import LoadingSpinner from './components/LoadingSpinner';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const [selectedCountry, setSelectedCountry] = useState('us');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  useEffect(() => {
    fetchNews(selectedCountry, selectedCategory, searchTerm);
  }, [selectedCountry, selectedCategory, searchTerm]);

  const fetchNews = useCallback(async (countryCode, category = 'all', search = '') => {
    setLoading(true);
    setError(null);
    try {
      let query = search;
      if (!search) {
        // Create query based on country and category
        const countryName = COUNTRIES.find(c => c.code === countryCode)?.name || '';
        query = category === 'all' ? countryName : `${countryName} ${category}`;
      }
      
      const response = await newsService.getAllNews(query);
      setNews(response.articles || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to fetch news. Please try again later.');
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setSearchTerm(''); // Clear search when changing country
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      fetchNews(selectedCountry, selectedCategory, '');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchNews(selectedCountry, selectedCategory, '');
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchTerm(''); // Clear search when changing category
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="app-title">🌍 Global News Explorer</h1>
            <p className="app-subtitle">Discover latest news from around the world</p>
          </div>
          <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
        </div>
      </header>

      <main className="app-main">
        {/* Country Selection Section */}
        <section className="country-section">
          <h2 className="section-title">Select a Country</h2>
          <div className="country-grid">
            {COUNTRIES.map((country) => (
              <CountryCard
                key={country.code}
                country={country}
                isSelected={selectedCountry === country.code}
                onClick={handleCountrySelect}
              />
            ))}
          </div>
        </section>

        {/* Search and Filters */}
        <section className="filters-section">
          <SearchBar 
            onSearch={handleSearch}
            searchTerm={searchTerm}
            onClear={handleClearSearch}
          />
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </section>

        {/* News Display Section */}
        <section className="news-section">
          <div className="section-header">
            <h2 className="section-title">
              {searchTerm 
                ? `Search Results for "${searchTerm}"` 
                : selectedCategory !== 'all'
                  ? `${COUNTRIES.find(c => c.code === selectedCountry)?.name} - ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} News`
                  : `Latest News from ${COUNTRIES.find(c => c.code === selectedCountry)?.name}`
              }
            </h2>
            {loading && <LoadingSpinner />}
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button 
                className="retry-button"
                onClick={() => fetchNews(selectedCountry)}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="news-grid">
              {news.length > 0 ? (
                news.map((article, index) => (
                  <NewsCard key={`${article.url}-${index}`} article={article} index={index} />
                ))
              ) : (
                <div className="no-news">
                  <p>No news articles found for this country.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>Powered by NewsAPI • Built with React & Vite</p>
      </footer>
    </div>
  );
}

export default App;
