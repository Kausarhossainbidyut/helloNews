import React from 'react';
import { motion } from 'framer-motion';
import { NEWS_CATEGORIES } from '../constants/countries';

const NewsCard = ({ article, index = 0 }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryName = (category) => {
    return NEWS_CATEGORIES[category] || category;
  };

  const getImageUrl = () => {
    if (article.urlToImage) {
      return article.urlToImage;
    }
    // Fallback to a placeholder image service
    return `https://placehold.co/600x400/333333/FFFFFF?text=${encodeURIComponent(article.source?.name || 'News')}`;
  };

  return (
    <motion.div 
      className="news-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
    >
      <a 
        href={article.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="news-card-link"
      >
        <div className="news-image-container">
          <img 
            src={getImageUrl()} 
            alt={article.title}
            className="news-image"
            onError={(e) => {
              e.target.src = `https://placehold.co/600x400/333333/FFFFFF?text=${encodeURIComponent(article.source?.name || 'News')}`;
            }}
          />
          <div className="news-category-badge">
            {getCategoryName(article.category || 'general')}
          </div>
        </div>
        <div className="news-content">
          <h3 className="news-title">{article.title}</h3>
          <p className="news-description">{article.description || 'No description available'}</p>
          <div className="news-meta">
            <span className="news-source">{article.source?.name || 'Unknown Source'}</span>
            <span className="news-date">{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export default NewsCard;