import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import GDPPerCapitaChart from './charts/GDPPerCapitaChart';
import PopulationGDPChart from './charts/PopulationGDPChart';
import RegionalGDPChart from './charts/RegionalGDPChart';
import UrbanizationMap from './charts/UrbanizationMap';

import DevelopmentTrendsChart from './charts/DevelopmentTrendsChart';
import CorrelationMatrix from './charts/CorrelationMatrix';
import SuicideGdpScatterPlot from './charts/SuicideGdpScatterPlot';
import WellbeingHistogram from './charts/WellbeingHistogram';
import OnePersonHouseholdChart from './charts/OnePersonHouseholdChart';
import InequalityTrendChart from './charts/InequalityTrendChart';
import PCAClassificationChart from './charts/PCAClassificationChart';
import NordicGdpSocialChart from './charts/NordicGdpSocialChart';
import NordicDependencySupportChart from './charts/NordicDependencySupportChart';
import FertilityScatterChart from './charts/FertilityScatterChart';
import SuicideStrainChart from './charts/SuicideStrainChart';
import WorkWellbeingChart from './charts/WorkWellbeingChart';
import FertilityTrendsChart from './charts/FertilityTrendsChart';
import IndicatorDistributionsChart from './charts/IndicatorDistributionsChart';
import CountryProfilesChart from './charts/CountryProfilesChart';

const VisualizationSection = ({ title, description, chartType, data, index, countryMapping }) => {
  const layout = index % 2 === 0 ? 'left' : 'right';
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'gdpPerCapita':
        return <GDPPerCapitaChart data={data} />;
      case 'regionalGDP':
        return <RegionalGDPChart data={data} />;
      case 'populationGDP':
        return <PopulationGDPChart data={data} />;
      case 'urbanizationMap':
        return <UrbanizationMap data={data} />;
      case 'developmentTrends':
        return <DevelopmentTrendsChart data={data} />;
      case 'correlationMatrix':
        return <CorrelationMatrix data={data} />;
      case 'suicideGdp':
        return <SuicideGdpScatterPlot data={data} />;
      case 'wellbeingHistogram':
        return <WellbeingHistogram data={data} />;
      case 'onePersonHousehold':
        return <OnePersonHouseholdChart data={data} />;
      case 'inequalityTrend':
        return <InequalityTrendChart data={data} />;
      case 'pcaClassification':
        return <PCAClassificationChart data={data} countryMapping={countryMapping} />;
      case 'nordicGdpSocial':
        return <NordicGdpSocialChart data={data} />;
      case 'nordicDependencySupport':
        return <NordicDependencySupportChart data={data} />;
      case 'fertilityScatter':
        return <FertilityScatterChart data={data} />;
      case 'suicideStrain':
        return <SuicideStrainChart data={data} />;
      case 'workWellbeing':
        return <WorkWellbeingChart data={data} />;
      case 'fertilityTrends':
        return <FertilityTrendsChart data={data} />;
      case 'indicatorDistributions':
        return <IndicatorDistributionsChart data={data} />;
      case 'countryProfiles':
        return <CountryProfilesChart data={data} />;
      default:
        return <div>Chart not found</div>;
    }
  };

  const chartSection = (
    <motion.div
      className="w-full lg:col-span-8 h-[60vh] lg:h-[75vh]"
      initial={{ opacity: 0, x: layout === 'left' ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="glass rounded-3xl p-6 glow h-full w-full flex items-center justify-center bg-slate-800/40 backdrop-blur-md border border-white/10 shadow-2xl">
        {renderChart()}
      </div>
    </motion.div>
  );

  const detailsSection = (
    <motion.div
      className="w-full lg:col-span-4 flex flex-col justify-center"
      initial={{ opacity: 0, x: layout === 'left' ? 50 : -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="space-y-8 p-6">
        <h2 className="text-5xl md:text-6xl font-bold gradient-text leading-tight">
          {title}
        </h2>
        <p className="text-xl text-slate-300 leading-relaxed font-light">
          {description}
        </p>
        <div className="glass rounded-2xl p-6 bg-white/5 border border-white/10">
          <h3 className="text-xl font-semibold mb-4 text-primary tracking-wide uppercase text-sm">Key Insights</h3>
          <ul className="space-y-3 text-slate-400 text-lg">
            <li className="flex items-start">
              <span className="text-secondary mr-3 text-xl">▸</span>
              <span>Global wealth distribution shows significant disparities across regions</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary mr-3 text-xl">▸</span>
              <span>Consumer spending patterns directly correlate with GDP per capita</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary mr-3 text-xl">▸</span>
              <span>Environmental impact scales with economic development</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.section
      ref={ref}
      className="visualization-section h-screen w-full snap-start flex items-center justify-center relative overflow-hidden px-4 md:px-12 py-8"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#0f172a] to-slate-900 -z-10" />
      
      <div className="w-full max-w-[1800px] mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${layout === 'right' ? 'direction-rtl' : ''}`}>
          {/* Re-order visually if layout is right, but keep grid structure */}
          {layout === 'left' ? (
            <>
              {chartSection}
              {detailsSection}
            </>
          ) : (
            <>
              {detailsSection}
              {chartSection}
            </>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.section>
  );
};

export default VisualizationSection;
