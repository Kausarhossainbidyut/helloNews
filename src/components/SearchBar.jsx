import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiSun, FiMoon } from 'react-icons/fi';

const SearchBar = ({ onSearch, searchTerm, onClear }) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    onClear();
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="search-bar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search news articles..."
          className="search-input"
        />
        <AnimatePresence>
          {inputValue && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="clear-button"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiX />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  );
};

export default SearchBar;