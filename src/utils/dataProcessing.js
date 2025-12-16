/**
 * Process GDP per capita data for visualization
 * Calculates global weighted average GDP per capita over time
 */
export const processGDPPerCapitaData = (data) => {
  // Filter valid data
  const validData = data.filter(row => 
    row.Year && 
    row['GDP per capita'] && 
    row.Population &&
    parseFloat(row['GDP per capita']) > 0 &&
    parseFloat(row.Population) > 0
  );

  // Group by year and calculate weighted averages
  const yearData = {};
  
  validData.forEach(row => {
    const year = row.Year;
    const gdpPerCapita = parseFloat(row['GDP per capita']);
    const population = parseFloat(row.Population);
    
    if (!yearData[year]) {
      yearData[year] = {
        totalWeightedGDP: 0,
        totalPopulation: 0
      };
    }
    
    yearData[year].totalWeightedGDP += gdpPerCapita * population;
    yearData[year].totalPopulation += population;
  });

  // Calculate weighted averages for each year
  const result = Object.keys(yearData).map(year => ({
    year: parseInt(year),
    weightedGDPPerCapita: yearData[year].totalWeightedGDP / yearData[year].totalPopulation
  }));

  return result.sort((a, b) => a.year - b.year);
};

/**
 * Process population vs GDP data
 * Groups countries by income level
 */
export const processPopulationGDPData = (data) => {
  const recentData = data.filter(row => 
    row.Year === '2022' && 
    row['GDP total'] && 
    row.Population &&
    parseFloat(row.Population) > 10000000 // Filter countries with pop > 10M
  );

  return recentData.map(row => ({
    country: row['Country Name'],
    population: parseFloat(row.Population) / 1000000, // Convert to millions
    gdp: parseFloat(row['GDP total']) / 1000000000, // Convert to billions
    incomeGroup: row['Income Group'],
    region: row.Region
  })).slice(0, 50); // Top 50 countries by data availability
};

/**
 * Process regional GDP data
 * Aggregates total GDP by region
 */
export const processRegionalGDPData = (data) => {
  const recentData = data.filter(row => 
    row.Year === '2022' && 
    row['GDP total'] &&
    parseFloat(row['GDP total']) > 0
  );

  const regionData = {};
  
  recentData.forEach(row => {
    const region = row.Region || 'Other';
    const gdp = parseFloat(row['GDP total']) / 1000000000; // Convert to billions
    
    if (!regionData[region]) {
      regionData[region] = 0;
    }
    
    regionData[region] += gdp;
  });

  return Object.keys(regionData).map(region => ({
    region,
    gdp: regionData[region]
  })).sort((a, b) => b.gdp - a.gdp);
};

/**
 * Get color palette for charts
 */
export const getChartColors = () => ({
  primary: 'rgba(99, 102, 241, 0.8)',
  primaryLight: 'rgba(99, 102, 241, 0.2)',
  secondary: 'rgba(236, 72, 153, 0.8)',
  secondaryLight: 'rgba(236, 72, 153, 0.2)',
  accent: 'rgba(245, 158, 11, 0.8)',
  accentLight: 'rgba(245, 158, 11, 0.2)',
  gradient: [
    'rgba(99, 102, 241, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(59, 130, 246, 0.8)',
  ]
});

/**
 * Format large numbers for display
 */
export const formatNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toFixed(2);
};

/**
 * Process GNI per capita data for visualization
 * Calculates global GNI per capita trends over time
 */
export const processGNIPerCapitaData = (data) => {
  // Filter valid data and exclude aggregate regions (only individual countries)
  const validData = data.filter(row => 
    row.Year && 
    row.GNI_PPP &&
    parseFloat(row.GNI_PPP) > 0
  );

  // We'll calculate global average (use "World" entry if available, or calculate manually)
  const worldData = validData.filter(row => row.Country_Code === 'WLD');
  
  if (worldData.length > 0) {
    // Use World aggregate data
    const result = worldData.map(row => ({
      year: parseInt(row.Year),
      gniPerCapita: parseFloat(row.GNI_PPP)
    }));
    return result.sort((a, b) => a.year - b.year);
  } else {
    // Calculate global average manually by grouping by year
    const yearData = {};
    
    validData.forEach(row => {
      const year = row.Year;
      const gniPerCapita = parseFloat(row.GNI_PPP);
      
      // Skip regional aggregates, only use individual countries
      if (!row.Country_Code || row.Country_Code.length !== 3) return;
      
      if (!yearData[year]) {
        yearData[year] = {
          totalGNI: 0,
          count: 0
        };
      }
      
      yearData[year].totalGNI += gniPerCapita;
      yearData[year].count += 1;
    });

    // Calculate averages for each year
    const result = Object.keys(yearData).map(year => ({
      year: parseInt(year),
      gniPerCapita: yearData[year].totalGNI / yearData[year].count
    }));

    return result.sort((a, b) => a.year - b.year);
  }
};

/**
 * Process urbanization data for map visualization
 * Groups by country and year, fills missing data, interpolates
 */
export const processUrbanizationData = (data) => {
  // Regional mapping for missing data interpolation
  const regionMapping = {
    'USA': 'North America', 'CAN': 'North America', 'MEX': 'North America',
    'BRA': 'South America', 'ARG': 'South America', 'CHL': 'South America', 'PER': 'South America',
    'COL': 'South America', 'VEN': 'South America', 'ECU': 'South America', 'BOL': 'South America',
    'GBR': 'Europe', 'FRA': 'Europe', 'DEU': 'Europe', 'ITA': 'Europe', 'ESP': 'Europe',
    'POL': 'Europe', 'ROU': 'Europe', 'NLD': 'Europe', 'BEL': 'Europe', 'GRC': 'Europe',
    'CHN': 'Asia', 'IND': 'Asia', 'JPN': 'Asia', 'KOR': 'Asia', 'IDN': 'Asia',
    'THA': 'Asia', 'VNM': 'Asia', 'PHL': 'Asia', 'MYS': 'Asia', 'SGP': 'Asia',
    'ZAF': 'Africa', 'EGY': 'Africa', 'NGA': 'Africa', 'KEN': 'Africa', 'ETH': 'Africa',
    'GHA': 'Africa', 'TZA': 'Africa', 'UGA': 'Africa', 'DZA': 'Africa', 'MAR': 'Africa',
    'AUS': 'Oceania', 'NZL': 'Oceania', 'PNG': 'Oceania', 'FJI': 'Oceania'
  };

  // Filter valid data for 1960-2022 only
  const validData = data.filter(row =>
    row.ISO3 &&
    row.Year &&
    row.Urban_Population_Percent &&
    parseInt(row.Year) >= 1960 &&
    parseInt(row.Year) <= 2022 &&
    parseFloat(row.Urban_Population_Percent) >= 0
  );

  // Group by ISO3 code and year
  // Strategy: The CSV contains breakdown of urban population (summing to 100).
  // We want to show the most significant component (e.g. largest city/agglomeration)
  // so we filter out the "100.0" total rows and take the maximum of the remaining rows.
  const groupedData = {};
  
  validData.forEach(row => {
    const key = `${row.ISO3}-${row.Year}`;
    const urbanPercent = parseFloat(row.Urban_Population_Percent);
    
    // Skip the "Total" rows (100%) and invalid 0s to find the significant breakdown value
    if (urbanPercent >= 99.9 || urbanPercent <= 0) return;

    if (!groupedData[key]) {
      groupedData[key] = {
        iso3: row.ISO3,
        year: parseInt(row.Year),
        maxUrban: urbanPercent
      };
    } else {
      // Take the maximum of the components (e.g. population in largest city)
      groupedData[key].maxUrban = Math.max(groupedData[key].maxUrban, urbanPercent);
    }
  });

  // Extract values
  let result = Object.values(groupedData).map(item => ({
    iso3: item.iso3,
    year: item.year,
    urbanPercent: item.maxUrban
  }));

  // Get all unique countries and years
  const allCountries = [...new Set(result.map(d => d.iso3))];
  const years = Array.from({ length: 2022 - 1960 + 1 }, (_, i) => 1960 + i);

  // Calculate regional averages for each year
  const regionalAverages = {};
  years.forEach(year => {
    const regions = {};
    result.filter(d => d.year === year).forEach(d => {
      const region = regionMapping[d.iso3] || 'World';
      if (!regions[region]) {
        regions[region] = { total: 0, count: 0 };
      }
      regions[region].total += d.urbanPercent;
      regions[region].count += 1;
    });
    
    regionalAverages[year] = {};
    Object.keys(regions).forEach(region => {
      regionalAverages[year][region] = regions[region].total / regions[region].count;
    });
    
    // Calculate world average as fallback
    const allYearData = result.filter(d => d.year === year);
    if (allYearData.length > 0) {
      regionalAverages[year]['World'] = 
        allYearData.reduce((sum, d) => sum + d.urbanPercent, 0) / allYearData.length;
    }
  });

  // Fill missing data with interpolation and regional averages
  const completeData = [];
  
  allCountries.forEach(iso3 => {
    const countryData = result.filter(d => d.iso3 === iso3).sort((a, b) => a.year - b.year);
    const region = regionMapping[iso3] || 'World';
    
    years.forEach(year => {
      const existing = countryData.find(d => d.year === year);
      
      if (existing) {
        completeData.push(existing);
      } else {
        // Try interpolation first
        const before = countryData.filter(d => d.year < year).pop();
        const after = countryData.find(d => d.year > year);
        
        let urbanPercent;
        
        if (before && after) {
          // Linear interpolation
          const ratio = (year - before.year) / (after.year - before.year);
          urbanPercent = before.urbanPercent + ratio * (after.urbanPercent - before.urbanPercent);
        } else if (before) {
          // Use last known value
          urbanPercent = before.urbanPercent;
        } else if (after) {
          // Use next known value
          urbanPercent = after.urbanPercent;
        } else {
          // Use regional average or world average
          urbanPercent = regionalAverages[year][region] || regionalAverages[year]['World'] || 50;
        }
        
        completeData.push({ iso3, year, urbanPercent });
      }
    });
  });

  // Structure data by year for efficient lookup
  const dataByYear = {};
  years.forEach(year => {
    dataByYear[year] = completeData.filter(d => d.year === year);
  });

  return {
    data: completeData,
    years,
    dataByYear
  };
};

/**
 * Process development indicators data for line chart visualization
 * Extracts global trends (ISO3 = 'WLD') for multiple indicators
 */
export const processDevelopmentData = (data) => {
  // Filter for World data only
  const worldData = data.filter(row => row.ISO3 === 'WLD' || row.ISO3 === 'World');
  
  // Sort by year
  worldData.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));

  // Extract years
  const years = worldData.map(d => parseInt(d.Year));

  // Extract indicators
  const indicators = {
    'Life_Expectancy': {
      label: 'Life Expectancy (Years)',
      data: worldData.map(d => parseFloat(d.Life_Expectancy) || null),
      color: '#10b981', // Emerald
      yAxisLabel: 'Years'
    },
    'Literacy_Rate': {
      label: 'Literacy Rate (%)',
      data: worldData.map(d => parseFloat(d.Literacy_Rate) || null),
      color: '#3b82f6', // Blue
      yAxisLabel: 'Percentage (%)'
    },
    'Infant_Mortality_Rate': {
      label: 'Infant Mortality Rate (per 1000)',
      data: worldData.map(d => parseFloat(d.Infant_Mortality_Rate) || null),
      color: '#ef4444', // Red
      yAxisLabel: 'Deaths per 1000 births'
    },
    'Health_Exp_Per_Capita': {
      label: 'Health Expenditure per Capita (USD)',
      data: worldData.map(d => parseFloat(d.Health_Exp_Per_Capita) || null),
      color: '#8b5cf6', // Purple
      yAxisLabel: 'USD ($)'
    }
  };

  return {
    years,
    indicators
  };
};

/**
 * Helper to filter data to start from the first valid year
 */
export const getFilteredChartData = (years, indicatorData) => {
  const firstValidIndex = indicatorData.findIndex(val => val !== null);
  if (firstValidIndex === -1) return { years: [], data: [] };
  
  return {
    years: years.slice(firstValidIndex),
    data: indicatorData.slice(firstValidIndex)
  };
};


/**
 * Process data for Correlation Matrix
 * Calculates Pearson correlation coefficients between selected indicators
 */
export const processCorrelationData = (data) => {
  // Define indicators to correlate (Expanded list)
  const indicators = [
    'Gini_Index', 'Wealth_Top10_Share', 'Corruption_Control', 
    'Poverty_Rate', 'Child_Poverty_Rate', 'House_Price_to_Income', 
    'Household_Debt_to_Income', 'Unemployment_Rate', 'Edu_Pub_Exp_GDP', 
    'Health_OOP_Perc', 'Suicide_Rate', 'Family_Trust_Raw', 
    'Family_Importance_Raw', 'One_Person_HH_Perc', 'Infant_Mortality_Rate', 
    'Homicide_Rate'
  ];
  
  const labels = [
    'Gini Index', 'Wealth Top 10%', 'Corruption Ctrl', 
    'Poverty', 'Child Poverty', 'House Price/Inc', 
    'Debt/Income', 'Unemployment', 'Edu Exp', 
    'Health OOP', 'Suicide', 'Family Trust', 
    'Family Imp', 'One Person HH', 'Infant Mort', 
    'Homicide'
  ];

  // Helper to calculate Pearson correlation
  const calculateCorrelation = (x, y) => {
    const n = x.length;
    if (n === 0) return 0;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const matrix = [];
  
  // Calculate correlation for each pair
  for (let i = 0; i < indicators.length; i++) {
    const row = [];
    for (let j = 0; j < indicators.length; j++) {
      // Extract valid pairs
      const validPairs = data.filter(d => 
        d[indicators[i]] && d[indicators[j]] && 
        !isNaN(parseFloat(d[indicators[i]])) && !isNaN(parseFloat(d[indicators[j]]))
      ).map(d => ({
        x: parseFloat(d[indicators[i]]),
        y: parseFloat(d[indicators[j]])
      }));

      const xValues = validPairs.map(p => p.x);
      const yValues = validPairs.map(p => p.y);
      
      row.push(calculateCorrelation(xValues, yValues));
    }
    matrix.push(row);
  }

  return { labels, matrix };
};

/**
 * Process data for Suicide vs GDP Scatter Plot
 */
export const processScatterData = (data) => {
  return data
    .filter(d => d.GDP_Per_Capita && d.Suicide_Rate)
    .map(d => ({
      x: parseFloat(d.GDP_Per_Capita),
      y: parseFloat(d.Suicide_Rate),
      country: d.Country,
      iso3: d.ISO3
    }))
    .filter(d => !isNaN(d.x) && !isNaN(d.y) && d.x > 0);
};

/**
 * Process data for Wellbeing Histogram
 */
export const processHistogramData = (data) => {
  const values = data
    .map(d => parseFloat(d.Well_Being_Index))
    .filter(v => !isNaN(v));

  if (values.length === 0) return { labels: [], data: [], rawData: [] };

  const min = Math.min(...values);
  const max = Math.max(...values);
  const binCount = 20;
  const binSize = (max - min) / binCount;

  const bins = new Array(binCount).fill(0);
  const labels = [];

  // Create labels
  for (let i = 0; i < binCount; i++) {
    const start = min + i * binSize;
    const end = start + binSize;
    labels.push(`${start.toFixed(2)} - ${end.toFixed(2)}`);
  }

  // Fill bins
  values.forEach(v => {
    const binIndex = Math.min(
      Math.floor((v - min) / binSize),
      binCount - 1
    );
    bins[binIndex]++;
  });

  return { labels, data: bins, rawData: values };
};

/**
 * Process data for One Person Household Scatter Plot
 */
export const processOnePersonHouseholdData = (data) => {
  return data
    .filter(d => d.GDP_Per_Capita && d.One_Person_HH_Perc)
    .map(d => ({
      x: parseFloat(d.GDP_Per_Capita),
      y: parseFloat(d.One_Person_HH_Perc),
      country: d.Country,
      iso3: d.ISO3
    }))
    .filter(d => !isNaN(d.x) && !isNaN(d.y) && d.x > 0);
};

/**
 * Process data for Inequality Trend Chart
 */
export const processInequalityData = (data) => {
  // Sort by year
  const sortedData = [...data].sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  
  const years = sortedData.map(d => parseInt(d.Year));
  
  const datasets = {
    lifeExpectancy: sortedData.map(d => parseFloat(d.Global_Life_Expectancy)),
    literacyRate: sortedData.map(d => parseFloat(d.Global_Literacy_Rate)),
    infantMortality: sortedData.map(d => parseFloat(d.Global_Infant_Mortality)),
    hospitalBeds: sortedData.map(d => parseFloat(d.Global_Hospital_Beds_Per_1000))
  };

  return { years, datasets };
};

/**
 * Process data for PCA Classification Chart (Scatter Plot)
 */
export const processPCAData = (data) => {
  const groups = {};
  
  data.forEach(d => {
    if (d.Group && d.ISI && d.SBI) {
      // Clean up group name
      const groupName = d.Group.replace(/^"|"$/g, '');
      
      if (!groups[groupName]) {
        groups[groupName] = [];
      }

      groups[groupName].push({
        x: parseFloat(d.ISI),
        y: parseFloat(d.SBI),
        country: d.ISO3, // Using ISO3 as label
        group: groupName
      });
    }
  });

  return groups; // Returns object with group names as keys and arrays of points as values
};

/**
 * Process data for Nordic Paradox Analysis (Updated)
 */
export const processNordicData = (data) => {
  const nordicCountries = ['Denmark', 'Finland', 'Iceland', 'Norway', 'Sweden'];
  
  // Chart 1: GDP vs Youth Social Support
  const gdpSocialData = {};
  nordicCountries.forEach(country => {
    gdpSocialData[country] = data
      .filter(d => d.Country === country && !isNaN(parseFloat(d.GDP_per_capita)) && !isNaN(parseFloat(d.Youth_Social_Support)))
      .map(d => ({
        x: parseFloat(d.GDP_per_capita),
        y: parseFloat(d.Youth_Social_Support),
        country: d.Country,
        year: d.Year
      }));
  });

  // Chart 2: Dependency Ratio vs Institutional Support
  const dependencySupportData = {};
  nordicCountries.forEach(country => {
    dependencySupportData[country] = data
      .filter(d => d.Country === country && !isNaN(parseFloat(d.Dependency_Ratio)) && !isNaN(parseFloat(d.Institutional_Social_Support)))
      .map(d => ({
        x: parseFloat(d.Dependency_Ratio),
        y: parseFloat(d.Institutional_Social_Support),
        country: d.Country,
        year: d.Year
      }));
  });

  return { gdpSocialData, dependencySupportData };
};

/**
 * Process data for Fertility Collapse Scatter
 */
export const processFertilityData = (data) => {
  return data
    .map(d => ({
      x: d.Country, // Categorical x-axis or we can use index if we want to show distribution
      y: parseFloat(d.Fertility_Rate),
      country: d.Country,
      iso3: d.ISO3
    }))
    .filter(d => !isNaN(d.y))
    .sort((a, b) => a.y - b.y); // Sort by fertility rate
};

/**
 * Process data for Suicide Strain Scatter
 */
export const processSuicideStrainData = (data) => {
  return data
    .map(d => ({
      x: parseFloat(d.GDP_Per_Capita),
      y: parseFloat(d.Suicide_Rate),
      country: d.Country,
      iso3: d.ISO3
    }))
    .filter(d => !isNaN(d.x) && !isNaN(d.y));
};

/**
 * Process data for Work vs Wellbeing Scatter
 */
export const processWorkWellbeingData = (data) => {
  return data
    .map(d => ({
      x: parseFloat(d.Work_Hours_Annual),
      y: parseFloat(d.Well_Being_Index),
      country: d.Country,
      iso3: d.ISO3
    }))
    .filter(d => !isNaN(d.x) && !isNaN(d.y));
};

/**
 * Process data for Fertility Rate Trends (Line Chart)
 */
export const processFertilityTrendsData = (data) => {
  // This will use 03_fertility_rate_trends.csv
  // Group by country
  const countries = {};
  
  data.forEach(d => {
    const country = d.Country;
    if (!country) return;
    
    if (!countries[country]) {
      countries[country] = [];
    }
    
    countries[country].push({
      year: parseInt(d.Year),
      fertility: parseFloat(d.Fertility_Rate)
    });
  });
  
  // Sort each country's data by year
  Object.keys(countries).forEach(country => {
    countries[country].sort((a, b) => a.year - b.year);
  });
  
  return countries;
};

/**
 * Process data for Indicator Distributions (Histogram Grid)
 */
export const processIndicatorDistributionsData = (data) => {
  const indicators = [
    { key: 'GDP_PC', label: 'GDP per Capita ($)' },
    { key: 'Gini', label: 'Inequality (Gini Index)' },
    { key: 'Urbanization', label: 'Urbanization (%)' },
    { key: 'Fertility', label: 'Fertility Rate' },
    { key: 'Suicide', label: 'Suicide Rate (per 100k)' },
    { key: 'Social_Protection', label: 'Social Protection (%)' }
  ];
  
  const distributions = {};
  
  indicators.forEach(({ key, label }) => {
    const values = data
      .map(d => parseFloat(d[key]))
      .filter(v => !isNaN(v));
    
    distributions[key] = {
      label,
      values,
      mean: values.reduce((a, b) => a + b, 0) / values.length,
      median: values.sort((a, b) => a - b)[Math.floor(values.length / 2)]
    };
  });
  
  return distributions;
};

/**
 * Process data for Country Profiles (Radar Chart Grid)
 */
export const processCountryProfilesData = (data) => {
  const profiles = {};
  
  data.forEach(d => {
    const country = d.Country;
    if (!country) return;
    
    profiles[country] = {
      Urbanization: parseFloat(d.Urbanization_Normalized) || 0,
      Inequality: parseFloat(d.Gini_Normalized) || 0,
      GDP: parseFloat(d.GDP_PC_Normalized) || 0,
      Fertility: parseFloat(d.Fertility_Normalized) || 0,
      'Suicide Rate': parseFloat(d.Suicide_Normalized) || 0,
      'Social Protection': parseFloat(d.Social_Protection_Normalized) || 0
    };
  });
  
  return profiles;
};

/**
 * Process data for HCC Inequality Crisis Scatter
 */
export const processInequalityCrisisData = (data) => {
  return data
    .map(d => ({
      x: parseFloat(d.Gini_Index),
      y: parseFloat(d.Wealth_Top10_Share),
      country: d.Country,
      iso3: d.ISO3
    }))
    .filter(d => !isNaN(d.x) && !isNaN(d.y));
};

/**
 * Process data for HCC Social Atomization Scatter
 */
export const processSocialAtomizationData = (data) => {
  return data
    .map(d => ({
      x: parseFloat(d.GDP_Per_Capita),
      y: parseFloat(d.One_Person_HH_Perc),
      country: d.Country,
      iso3: d.ISO3
    }))
    .filter(d => !isNaN(d.x) && !isNaN(d.y));
};

/**
 * Process data for HCC Debt Trap Scatter
 */
export const processDebtTrapData = (data) => {
  return data
    .map(d => ({
      x: parseFloat(d.GDP_Per_Capita),
      y: parseFloat(d.Household_Debt_to_Income),
      country: d.Country,
      iso3: d.ISO3
    }))
    .filter(d => !isNaN(d.x) && !isNaN(d.y));
};

/**
 * Process data for Ideal Comparative Analysis
 */
export const processIdealComparativeData = (data) => {
  // Get all available comparison metrics (all columns except Group and ISO3)
  if (data.length === 0) return { metrics: [], chartData: {} };
  
  const allColumns = Object.keys(data[0]);
  const metrics = allColumns.filter(col => col !== 'Group' && col !== 'ISO3');
  
  // Create chart data for each metric
  const chartData = {};
  
  metrics.forEach(metric => {
    chartData[metric] = data
      .map(d => ({
        country: d.Group, // Use Group column instead of Country
        value: parseFloat(d[metric])
      }))
      .filter(d => !isNaN(d.value))
      .sort((a, b) => b.value - a.value); // Sort descending
  });
  
  return { metrics, chartData };
};

/**
 * Process data for Wellbeing Best Predictors
 */
export const processBestPredictorsData = (data) => {
  return data
    .map(d => {
      let featureName = d.Indicator;
      if (featureName === 'Child_Poverty_Rate' || featureName === 'Child Poverty Rate (inverted)') {
        featureName = 'Child Poverty Rate (inverted)';
      }
      return {
        feature: featureName,
        coefficient: parseFloat(d.Correlation)
      };
    })
    .filter(d => !isNaN(d.coefficient))
    .sort((a, b) => b.coefficient - a.coefficient);
};

/**
 * Process data for Wellbeing Worst Predictors
 */
export const processWorstPredictorsData = (data) => {
  return data
    .map(d => ({
      feature: d.Indicator,
      coefficient: parseFloat(d.Correlation)
    }))
    .filter(d => !isNaN(d.coefficient))
    .sort((a, b) => a.coefficient - b.coefficient); // Sort ascending (most negative first)
};
