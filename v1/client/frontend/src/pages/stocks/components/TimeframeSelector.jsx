import React from 'react';

const TimeframeSelector = ({ timeframe, onTimeframeChange }) => {
  const timeframes = ['1D', '1W', '1M', '3M', '1Y'];

  return (
    <div className="timeframe-selector-stocks">
      <span className="timeframe-label">{'>'} TIMEFRAME:</span>
      <div className="timeframe-buttons">
        {timeframes.map(tf => (
          <button
            key={tf}
            className={`timeframe-btn-stock ${timeframe === tf ? 'active' : ''}`}
            onClick={() => onTimeframeChange(tf)}
          >
            {tf}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeframeSelector;