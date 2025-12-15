import React, { useState, useEffect, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { processUrbanizationData } from '../../utils/dataProcessing';
import './UrbanizationMap.css';

const geoUrl = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

const UrbanizationMap = ({ data }) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 0]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5x, 1x, 2x
  const [hasFinished, setHasFinished] = useState(false);

  const processedData = useMemo(() => processUrbanizationData(data), [data]);
  
  // Initialize selected year to the first year
  useEffect(() => {
    if (processedData.years.length > 0 && !selectedYear) {
      setSelectedYear(processedData.years[0]);
    }
  }, [processedData.years, selectedYear]);

  // Play/pause animation
  useEffect(() => {
    if (!isPlaying || !selectedYear) return;

    const interval = setInterval(() => {
      setSelectedYear(prevYear => {
        const currentIndex = processedData.years.indexOf(prevYear);
        if (currentIndex >= processedData.years.length - 1) {
          setIsPlaying(false);
          setHasFinished(true);
          // Reset to first year when animation completes
          return processedData.years[0];
        }
        setHasFinished(false);
        return processedData.years[currentIndex + 1];
      });
    }, 800 / playbackSpeed); // Speed: 0.5x = 1600ms, 1x = 800ms, 2x = 400ms

    return () => clearInterval(interval);
  }, [isPlaying, selectedYear, processedData.years, playbackSpeed]);

  // Get color based on urbanization percentage
  const getColor = (urbanPercent) => {
    if (urbanPercent === null || urbanPercent === undefined) return '#e2e8f0';
    if (urbanPercent >= 80) return '#312e81'; // Dark purple
    if (urbanPercent >= 70) return '#4c1d95'; // Purple
    if (urbanPercent >= 60) return '#6366f1'; // Indigo
    if (urbanPercent >= 50) return '#8b5cf6'; // Purple
    if (urbanPercent >= 40) return '#a855f7'; // Light purple
    if (urbanPercent >= 30) return '#c084fc'; // Lighter purple
    if (urbanPercent >= 20) return '#d8b4fe'; // Very light purple
    return '#e9d5ff'; // Lightest purple
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    setSelectedYear(processedData.years[0]);
    setHasFinished(false);
    setIsPlaying(true);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
    setIsPlaying(false);
    setHasFinished(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 8));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 1));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setCenter([0, 0]);
  };

  const handleMoveEnd = (position) => {
    setCenter(position.coordinates);
    setZoom(position.zoom);
  };

  if (!selectedYear || processedData.years.length === 0) {
    return (
      <div className="map-loading">
        <div className="spinner"></div>
        <p>Loading urbanization data...</p>
      </div>
    );
  }

  const yearData = processedData.dataByYear[selectedYear] || [];
  
  // Debug: Log data once when component mounts or year changes
  if (yearData.length > 0 && typeof window !== 'undefined' && !window.debugLogged) {
    console.log('=== Urbanization Data Debug ===');
    console.log('Year:', selectedYear, 'Countries with data:', yearData.length);
    console.log('Sample data (first 3):', yearData.slice(0, 3));
    console.log('Available ISO3 codes (first 20):', yearData.slice(0, 20).map(d => d.iso3).join(', '));
    window.debugLogged = true;
  }

  return (
    <div className="urbanization-map-container">
      <div className="world-map-container">
        <ComposableMap
          projectionConfig={{
            scale: 215
          }}
          style={{
            width: '100%',
            height: 'auto'
          }}
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            onMoveEnd={handleMoveEnd}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) => {
                // One-time debug log of GeoJSON structure
                if (geographies.length > 0 && !window.geoStructureLogged) {
                  console.log('=== GeoJSON Structure Debug ===');
                  console.log('Total countries in GeoJSON:', geographies.length);
                  const sample = geographies[0];
                  console.log('Sample country properties:', sample.properties);
                  console.log('All property keys:', Object.keys(sample.properties));
                  window.geoStructureLogged = true;
                }
                
                // Create comprehensive name-to-ISO3 mapping as fallback
                const nameToISO3 = {
                  'United States of America': 'USA', 'United States': 'USA', 'USA': 'USA',
                  'China': 'CHN', 'India': 'IND', 'Brazil': 'BRA', 'Russia': 'RUS',
                  'Japan': 'JPN', 'Germany': 'DEU', 'United Kingdom': 'GBR', 'France': 'FRA',
                  'Italy': 'ITA', 'Canada': 'CAN', 'Mexico': 'MEX', 'Spain': 'ESP',
                  'South Korea': 'KOR', 'Republic of Korea': 'KOR', 'Indonesia': 'IDN',
                  'Turkey': 'TUR', 'Saudi Arabia': 'SAU', 'Argentina': 'ARG', 'South Africa': 'ZAF',
                  'Australia': 'AUS', 'Egypt': 'EGY', 'Nigeria': 'NGA', 'Pakistan': 'PAK',
                  'Bangladesh': 'BGD', 'Vietnam': 'VNM', 'Philippines': 'PHL', 'Ethiopia': 'ETH',
                  'Democratic Republic of the Congo': 'COD', 'Iran': 'IRN', 'Thailand': 'THA',
                  'Myanmar': 'MMR', 'Colombia': 'COL', 'Kenya': 'KEN', 'Tanzania': 'TZA',
                  'Ukraine': 'UKR', 'Algeria': 'DZA', 'Sudan': 'SDN', 'Uganda': 'UGA',
                  'Iraq': 'IRQ', 'Poland': 'POL', 'Morocco': 'MAR', 'Uzbekistan': 'UZB',
                  'Malaysia': 'MYS', 'Peru': 'PER', 'Venezuela': 'VEN', 'Afghanistan': 'AFG',
                  'Ghana': 'GHA', 'Angola': 'AGO', 'Nepal': 'NPL', 'Yemen': 'YEM',
                  'Mozambique': 'MOZ', 'Ivory Coast': 'CIV', 'Côte d\'Ivoire': 'CIV',
                  'Madagascar': 'MDG', 'North Korea': 'PRK', 'Cameroon': 'CMR', 'Niger': 'NER',
                  'Taiwan': 'TWN', 'Sri Lanka': 'LKA', 'Burkina Faso': 'BFA', 'Mali': 'MLI',
                  'Romania': 'ROU', 'Chile': 'CHL', 'Kazakhstan': 'KAZ', 'Zambia': 'ZMB',
                  'Guatemala': 'GTM', 'Ecuador': 'ECU', 'Syria': 'SYR', 'Netherlands': 'NLD',
                  'Senegal': 'SEN', 'Cambodia': 'KHM', 'Chad': 'TCD', 'Somalia': 'SOM',
                  'Zimbabwe': 'ZWE', 'Guinea': 'GIN', 'Rwanda': 'RWA', 'Benin': 'BEN',
                  'Burundi': 'BDI', 'Tunisia': 'TUN', 'Bolivia': 'BOL', 'Belgium': 'BEL',
                  'Haiti': 'HTI', 'Cuba': 'CUB', 'South Sudan': 'SSD', 'Dominican Republic': 'DOM',
                  'Czech Republic': 'CZE', 'Greece': 'GRC', 'Jordan': 'JOR', 'Portugal': 'PRT',
                  'Azerbaijan': 'AZE', 'Sweden': 'SWE', 'Honduras': 'HND', 'United Arab Emirates': 'ARE',
                  'Hungary': 'HUN', 'Tajikistan': 'TJK', 'Belarus': 'BLR', 'Austria': 'AUT',
                  'Papua New Guinea': 'PNG', 'Serbia': 'SRB', 'Israel': 'ISR', 'Switzerland': 'CHE',
                  'Togo': 'TGO', 'Sierra Leone': 'SLE', 'Laos': 'LAO', 'Paraguay': 'PRY',
                  'Bulgaria': 'BGR', 'Libya': 'LBY', 'Lebanon': 'LBN', 'Nicaragua': 'NIC',
                  'Kyrgyzstan': 'KGZ', 'El Salvador': 'SLV', 'Turkmenistan': 'TKM', 'Singapore': 'SGP',
                  'Denmark': 'DNK', 'Finland': 'FIN', 'Slovakia': 'SVK', 'Norway': 'NOR',
                  'Oman': 'OMN', 'Costa Rica': 'CRI', 'Liberia': 'LBR', 'Ireland': 'IRL',
                  'Central African Republic': 'CAF', 'New Zealand': 'NZL', 'Mauritania': 'MRT',
                  'Panama': 'PAN', 'Kuwait': 'KWT', 'Croatia': 'HRV', 'Moldova': 'MDA',
                  'Georgia': 'GEO', 'Eritrea': 'ERI', 'Uruguay': 'URY', 'Bosnia and Herzegovina': 'BIH',
                  'Mongolia': 'MNG', 'Armenia': 'ARM', 'Jamaica': 'JAM', 'Qatar': 'QAT',
                  'Albania': 'ALB', 'Lithuania': 'LTU', 'Namibia': 'NAM', 'Gambia': 'GMB',
                  'Botswana': 'BWA', 'Gabon': 'GAB', 'Lesotho': 'LSO', 'North Macedonia': 'MKD',
                  'Slovenia': 'SVN', 'Guinea-Bissau': 'GNB', 'Latvia': 'LVA', 'Bahrain': 'BHR',
                  'Equatorial Guinea': 'GNQ', 'Trinidad and Tobago': 'TTO', 'Estonia': 'EST',
                  'Timor-Leste': 'TLS', 'Mauritius': 'MUS', 'Cyprus': 'CYP', 'Eswatini': 'SWZ',
                  'Djibouti': 'DJI', 'Fiji': 'FJI', 'Comoros': 'COM', 'Guyana': 'GUY',
                  'Bhutan': 'BTN', 'Solomon Islands': 'SLB', 'Montenegro': 'MNE', 'Luxembourg': 'LUX',
                  'Suriname': 'SUR', 'Cabo Verde': 'CPV', 'Maldives': 'MDV', 'Malta': 'MLT',
                  'Brunei': 'BRN', 'Belize': 'BLZ', 'Bahamas': 'BHS', 'Iceland': 'ISL'
                };
                
                return geographies.map((geo) => {
                  // Try multiple property paths for ISO3
                  let iso3 = geo.properties.ISO_A3 || 
                            geo.properties.iso_a3 || 
                            geo.properties.ADM0_A3 ||
                            geo.properties.iso3 ||
                            geo.id;
                  
                  // If still no ISO3, try name-based lookup
                  if (!iso3 || iso3 === '-99' || iso3.length !== 3) {
                    const name = geo.properties.ADMIN || geo.properties.name || geo.properties.NAME;
                    iso3 = nameToISO3[name] || iso3;
                  }
                  
                  const countryData = yearData.find(d => d.iso3 === iso3);
                  const urbanPercent = countryData?.urbanPercent;
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getColor(urbanPercent)}
                      stroke="#1e293b"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: 'none'
                        },
                        hover: {
                          fill: '#f59e0b',
                          outline: 'none',
                          stroke: '#fff',
                          strokeWidth: 1
                        },
                        pressed: {
                          outline: 'none'
                        }
                      }}
                      onMouseEnter={() => {
                        const name = geo.properties.ADMIN || geo.properties.name || geo.properties.NAME || 'Unknown';
                        const tooltip = urbanPercent !== undefined
                          ? `${name}: ${urbanPercent.toFixed(1)}%`
                          : `${name}: No data (${iso3})`;
                        setTooltipContent(tooltip);
                      }}
                      onMouseLeave={() => {
                        setTooltipContent('');
                      }}
                    />
                  );
                });
              }}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        
        {tooltipContent && (
          <div className="map-tooltip">
            {tooltipContent}
          </div>
        )}

        {/* Zoom Controls */}
        <div className="zoom-controls">
          <button 
            className="zoom-button"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            +
          </button>
          <button 
            className="zoom-button"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            −
          </button>
          <button 
            className="zoom-button reset-button"
            onClick={handleResetZoom}
            title="Reset View"
          >
            ⟲
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="map-controls">
        <div className="time-controls">
          <button 
            className="play-button"
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          
          <div className="year-slider">
            <input
              type="range"
              min={processedData.years[0]}
              max={processedData.years[processedData.years.length - 1]}
              value={selectedYear}
              onChange={handleYearChange}
              className="slider"
            />
            <span className="year-label">{selectedYear}</span>
          </div>
          
          {/* Speed Controls */}
          <div className="speed-controls" style={{ display: 'flex', gap: '4px', alignItems: 'center', marginLeft: '16px' }}>
            <span style={{ fontSize: '12px', color: '#cbd5e1', marginRight: '4px' }}>Speed:</span>
            {[1, 2, 4, 6].map(speed => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`speed-button ${playbackSpeed === speed ? 'active' : ''}`}
                style={{
                  padding: '4px 12px',
                  fontSize: '11px',
                  backgroundColor: playbackSpeed === speed ? '#6366f1' : '#334155',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="map-legend">
          <h4>Urbanization %</h4>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#312e81' }}></span>
              <span>80%+</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#4c1d95' }}></span>
              <span>70-80%</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#6366f1' }}></span>
              <span>60-70%</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></span>
              <span>50-60%</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#a855f7' }}></span>
              <span>40-50%</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#c084fc' }}></span>
              <span>30-40%</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#d8b4fe' }}></span>
              <span>20-30%</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#e9d5ff' }}></span>
              <span>0-20%</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#e2e8f0' }}></span>
              <span>No data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrbanizationMap;
