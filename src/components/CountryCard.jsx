import React from 'react';

const CountryCard = ({ country, isSelected, onClick }) => {
  return (
    <div 
      className={`country-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(country.code)}
    >
      <div className="country-flag">{country.flag}</div>
      <div className="country-name">{country.name}</div>
    </div>
  );
};

export default CountryCard;