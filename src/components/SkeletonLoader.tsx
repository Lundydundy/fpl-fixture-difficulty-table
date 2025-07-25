import React from 'react';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  type: 'table' | 'controls' | 'text' | 'card';
  rows?: number;
  columns?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type,
  rows = 5,
  columns = 6,
  className = ''
}) => {
  const renderTableSkeleton = () => (
    <div className="skeleton-loader__table">
      {/* Table header */}
      <div className="skeleton-loader__table-header">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="skeleton-loader__cell skeleton-loader__cell--header" />
        ))}
      </div>
      
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-loader__table-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="skeleton-loader__cell" />
          ))}
        </div>
      ))}
    </div>
  );

  const renderControlsSkeleton = () => (
    <div className="skeleton-loader__controls">
      <div className="skeleton-loader__control-group">
        <div className="skeleton-loader__label" />
        <div className="skeleton-loader__input" />
      </div>
      <div className="skeleton-loader__control-group">
        <div className="skeleton-loader__label" />
        <div className="skeleton-loader__input" />
      </div>
      <div className="skeleton-loader__control-group">
        <div className="skeleton-loader__legend" />
      </div>
    </div>
  );

  const renderTextSkeleton = () => (
    <div className="skeleton-loader__text">
      <div className="skeleton-loader__line skeleton-loader__line--title" />
      <div className="skeleton-loader__line skeleton-loader__line--subtitle" />
      <div className="skeleton-loader__line" />
      <div className="skeleton-loader__line skeleton-loader__line--short" />
    </div>
  );

  const renderCardSkeleton = () => (
    <div className="skeleton-loader__card">
      <div className="skeleton-loader__card-header" />
      <div className="skeleton-loader__card-content">
        <div className="skeleton-loader__line" />
        <div className="skeleton-loader__line skeleton-loader__line--short" />
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'table':
        return renderTableSkeleton();
      case 'controls':
        return renderControlsSkeleton();
      case 'text':
        return renderTextSkeleton();
      case 'card':
        return renderCardSkeleton();
      default:
        return renderTextSkeleton();
    }
  };

  return (
    <div className={`skeleton-loader ${className}`} aria-label="Loading content">
      {renderSkeleton()}
    </div>
  );
};

export default SkeletonLoader;