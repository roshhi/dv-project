import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Hero from './components/Hero';
import VisualizationSection from './components/VisualizationSection';
import ThankYouSection from './components/ThankYouSection';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function App() {
  const [gdpData, setGdpData] = useState([]); // Renamed 'data' to 'gdpData' to match instruction's useEffect
  const [gniData, setGniData] = useState([]);
  const [urbanizationData, setUrbanizationData] = useState([]);
  const [developmentData, setDevelopmentData] = useState([]);
  const [correlationData, setCorrelationData] = useState([]);
  const [suicideData, setSuicideData] = useState([]);
  const [wellbeingData, setWellbeingData] = useState([]);
  const [householdData, setHouseholdData] = useState([]);
  const [inequalityData, setInequalityData] = useState([]);
  const [pcaData, setPcaData] = useState([]);
  const [nordicData, setNordicData] = useState([]);
  const [fertilityData, setFertilityData] = useState([]);
  const [suicideStrainData, setSuicideStrainData] = useState([]);
  const [workWellbeingData, setWorkWellbeingData] = useState([]);
  const [fertilityTrendsData, setFertilityTrendsData] = useState([]);
  const [indicatorDistData, setIndicatorDistData] = useState([]);
  const [countryProfilesData, setCountryProfilesData] = useState([]);
  const [inequalityCrisisData, setInequalityCrisisData] = useState([]);
  const [socialAtomizationData, setSocialAtomizationData] = useState([]);
  const [debtTrapData, setDebtTrapData] = useState([]);
  const [idealComparativeData, setIdealComparativeData] = useState([]);
  const [wellbeingBestData, setWellbeingBestData] = useState([]);
  const [wellbeingWorstData, setWellbeingWorstData] = useState([]);
  const [countryMapping, setCountryMapping] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load GDP Data (and create mapping)
        const gdpResponse = await fetch('/gdp_population_merged.csv');
        const gdpText = await gdpResponse.text();
        const parsedGdp = Papa.parse(gdpText, { header: true }).data;
        setGdpData(parsedGdp);

        // Create ISO3 to Name mapping
        const mapping = {};
        parsedGdp.forEach(d => {
          if (d.Code && d.Entity) mapping[d.Code] = d.Entity;
        });
        setCountryMapping(mapping);

        // Load GNI Data
        const gniResponse = await fetch('/GNI_PPP_processed.csv');
        const gniText = await gniResponse.text();
        const parsedGni = Papa.parse(gniText, { header: true }).data;
        setGniData(parsedGni);

        // Load Urbanization Data
        const urbanResponse = await fetch('/urbanization_timeseries.csv');
        const urbanText = await urbanResponse.text();
        const parsedUrban = Papa.parse(urbanText, { header: true }).data;
        setUrbanizationData(parsedUrban);

        // Load Development Indicators Data
        const devResponse = await fetch('/development_indicators_timeseries.csv');
        const devText = await devResponse.text();
        const parsedDev = Papa.parse(devText, { header: true }).data;
        setDevelopmentData(parsedDev);

        // Load Correlation Matrix Data
        const corrResponse = await fetch('/correlation_matrix_data.csv');
        const corrText = await corrResponse.text();
        const parsedCorr = Papa.parse(corrText, { header: true }).data;
        setCorrelationData(parsedCorr);

        // Load Suicide vs GDP Data
        const suicideResponse = await fetch('/gdp_vs_suicide.csv');
        const suicideText = await suicideResponse.text();
        const parsedSuicide = Papa.parse(suicideText, { header: true }).data;
        setSuicideData(parsedSuicide);

        // Load Wellbeing Data
        const wellbeingResponse = await fetch('/wellbeing_index_distribution.csv');
        const wellbeingText = await wellbeingResponse.text();
        const parsedWellbeing = Papa.parse(wellbeingText, { header: true }).data;
        setWellbeingData(parsedWellbeing);

        // Load One Person Household Data
        const householdResponse = await fetch('/one_person_household.csv');
        const householdText = await householdResponse.text();
        const parsedHousehold = Papa.parse(householdText, { header: true }).data;
        setHouseholdData(parsedHousehold);

        // Load Inequality Index Data
        const inequalityResponse = await fetch('/inequality_index.csv');
        const inequalityText = await inequalityResponse.text();
        const parsedInequality = Papa.parse(inequalityText, { header: true }).data;
        setInequalityData(parsedInequality);

        // Load PCA Classification Data
        const pcaResponse = await fetch('/pca_country_classification.csv');
        const pcaText = await pcaResponse.text();
        const parsedPca = Papa.parse(pcaText, { header: true }).data;
        setPcaData(parsedPca);

        // Load Nordic Data
        const nordicResponse = await fetch('/inst_vs_soc_aligned_data.csv');
        const nordicText = await nordicResponse.text();
        const parsedNordic = Papa.parse(nordicText, { header: true }).data;
        setNordicData(parsedNordic);

        // Load Fertility Data
        const fertilityResponse = await fetch('/dev_strain_fertility_collapse.csv');
        const fertilityText = await fertilityResponse.text();
        const parsedFertility = Papa.parse(fertilityText, { header: true }).data;
        setFertilityData(parsedFertility);

        // Load Suicide Strain Data
        const suicideStrainResponse = await fetch('/dev_strain_suicide_gdp.csv');
        const suicideStrainText = await suicideStrainResponse.text();
        const parsedSuicideStrain = Papa.parse(suicideStrainText, { header: true }).data;
        setSuicideStrainData(parsedSuicideStrain);

        // Load Work Wellbeing Data
        const workResponse = await fetch('/dev_strain_work_wellbeing.csv');
        const workText = await workResponse.text();
        const parsedWork = Papa.parse(workText, { header: true }).data;
        setWorkWellbeingData(parsedWork);

        // Load Fertility Trends Data
        const fertTrendsResponse = await fetch('/03_fertility_rate_trends.csv');
        const fertTrendsText = await fertTrendsResponse.text();
        const parsedFertTrends = Papa.parse(fertTrendsText, { header: true }).data;
        setFertilityTrendsData(parsedFertTrends);

        // Load Indicator Distributions Data
        const indDistResponse = await fetch('/06_indicator_distributions.csv');
        const indDistText = await indDistResponse.text();
        const parsedIndDist = Papa.parse(indDistText, { header: true }).data;
        setIndicatorDistData(parsedIndDist);

        // Load Country Profiles Data
        const profilesResponse = await fetch('/10_country_radar_profiles.csv');
        const profilesText = await profilesResponse.text();
        const parsedProfiles = Papa.parse(profilesText, { header: true }).data;
        setCountryProfilesData(parsedProfiles);

        // Load HCC Inequality Crisis Data
        const ineqCrisisResponse = await fetch('/hcc_inequality_crisis.csv');
        const ineqCrisisText = await ineqCrisisResponse.text();
        const parsedIneqCrisis = Papa.parse(ineqCrisisText, { header: true }).data;
        setInequalityCrisisData(parsedIneqCrisis);

        // Load HCC Social Atomization Data
        const socialAtomResponse = await fetch('/hcc_social_atomizationx.csv');
        const socialAtomText = await socialAtomResponse.text();
        const parsedSocialAtom = Papa.parse(socialAtomText, { header: true }).data;
        setSocialAtomizationData(parsedSocialAtom);

        // Load HCC Debt Trap Data
        const debtTrapResponse = await fetch('/hcc_debt_trap.csv');
        const debtTrapText = await debtTrapResponse.text();
        const parsedDebtTrap = Papa.parse(debtTrapText, { header: true }).data;
        setDebtTrapData(parsedDebtTrap);

        // Load Ideal Comparative Analysis Data
        const idealCompResponse = await fetch('/ideal_comparative_analysis.csv');
        const idealCompText = await idealCompResponse.text();
        const parsedIdealComp = Papa.parse(idealCompText, { header: true }).data;
        setIdealComparativeData(parsedIdealComp);

        // Load Wellbeing Best Predictors Data
        const wellbeingBestResponse = await fetch('/wellbeing_best_predictors.csv');
        const wellbeingBestText = await wellbeingBestResponse.text();
        const parsedWellbeingBest = Papa.parse(wellbeingBestText, { header: true }).data;
        setWellbeingBestData(parsedWellbeingBest);

        // Load Wellbeing Worst Predictors Data
        const wellbeingWorstResponse = await fetch('/wellbeing_worst_predictors.csv');
        const wellbeingWorstText = await wellbeingWorstResponse.text();
        const parsedWellbeingWorst = Papa.parse(wellbeingWorstText, { header: true }).data;
        setWellbeingWorstData(parsedWellbeingWorst);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-white">
        <div className="text-2xl font-bold animate-pulse">Loading Visualization Data...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      <Hero />
      
      <VisualizationSection
        title="Global GDP Per Capita Trend (1950-2022)"
        description="Explore the dramatic rise in global economic prosperity over the last seven decades. This visualization tracks the weighted average GDP per capita, revealing the accelerating pace of economic growth and the impact of global development initiatives."
        chartType="gdpPerCapita"
        data={gdpData}
        index={0}
      />

      <VisualizationSection
        title="Global GNI Per Capita Trend (PPP)"
        description="Analyze the growth of Gross National Income per capita adjusted for Purchasing Power Parity. This metric provides a more accurate reflection of the average citizen's purchasing power and standard of living improvements globally."
        chartType="populationGDP"
        data={gniData}
        index={1}
      />

      <VisualizationSection
        title="Global Urbanization Through Time"
        description="Witness the massive shift of human population from rural to urban areas. This interactive map visualizes the percentage of population living in urban centers across different countries, highlighting the rapid urbanization of the modern world."
        chartType="urbanizationMap"
        data={urbanizationData}
        index={2}
      />

      <VisualizationSection
        title="Global Development Trends"
        description="Track key indicators of human progress including Life Expectancy, Literacy Rates, and Healthcare metrics. This interactive chart reveals the correlation between economic growth and improvements in quality of life worldwide."
        chartType="developmentTrends"
        data={developmentData}
        index={3}
      />

      <VisualizationSection
        title="Socioeconomic Correlation Matrix"
        description="Uncover hidden relationships between various socioeconomic factors. This heatmap reveals how indicators like Inequality, Poverty, and Unemployment correlate with social outcomes like Suicide Rates and Family Trust."
        chartType="correlationMatrix"
        data={correlationData}
        index={4}
      />

      <VisualizationSection
        title="Wealth vs Despair: No Linear Fix"
        description="Investigate the complex relationship between economic wealth (GDP per Capita) and mental health outcomes (Suicide Rate). The scatter plot reveals that higher wealth does not automatically guarantee lower suicide rates, challenging common assumptions."
        chartType="suicideGdp"
        data={suicideData}
        index={5}
      />

      <VisualizationSection
        title="Global Wellbeing Distribution"
        description="Analyze how wellbeing is distributed across nations. This histogram provides a snapshot of global happiness and satisfaction levels, highlighting the disparities and commonalities in human experience worldwide."
        chartType="wellbeingHistogram"
        data={wellbeingData}
        index={6}
      />

      <VisualizationSection
        title="Solitude vs Wealth"
        description="Explore the correlation between economic prosperity and the rise of one-person households. As nations become wealthier, social structures often shift towards more individualistic living arrangements."
        chartType="onePersonHousehold"
        data={householdData}
        index={7}
      />

      <VisualizationSection
        title="Global Inequality Trends"
        description="Track the evolution of global inequality indicators over time. This chart visualizes how disparities in life expectancy, literacy, and health outcomes have changed, reflecting the ongoing challenge of equitable development."
        chartType="inequalityTrend"
        data={inequalityData}
        index={8}
      />

      <VisualizationSection
        title="Country Classification (PCA)"
        description="Visualize the distribution of countries across different socioeconomic clusters identified through Principal Component Analysis. This chart groups nations with similar developmental characteristics."
        chartType="pcaClassification"
        data={pcaData}
        countryMapping={countryMapping}
        index={9}
      />

      <VisualizationSection
        title="GDP vs Youth Social Support"
        description="Explore the inverse relationship between economic prosperity and youth social support in Nordic countries. As GDP increases, youth social support tends to decrease, revealing a critical tension in modern wealthy societies."
        chartType="nordicGdpSocial"
        data={nordicData}
        index={10}
      />

      <VisualizationSection
        title="Dependency Ratio vs Institutional Support"
        description="Analyze how the dependency ratio (proportion of dependents to working-age population) correlates negatively with institutional social support across Nordic nations, highlighting the strain of aging populations on social systems."
        chartType="nordicDependencySupport"
        data={nordicData}
        index={11}
      />

      <VisualizationSection
        title="Fertility Collapse"
        description="Analyze the global trend of declining fertility rates. This scatter plot illustrates how development strains often correlate with a collapse in fertility, posing long-term demographic challenges."
        chartType="fertilityScatter"
        data={fertilityData}
        index={12}
      />

      <VisualizationSection
        title="Development Strain: Suicide vs GDP"
        description="Revisit the relationship between economic output and suicide rates with a focused dataset, highlighting how the pressures of development can manifest in mental health crises."
        chartType="suicideStrain"
        data={suicideStrainData}
        index={13}
      />

      <VisualizationSection
        title="Fertility Rate Trends: Family Structure Evolution"
        description="Track the evolution of fertility rates across developing nations from 1990 to 2020. Observe how countries converge toward or fall below the replacement level of 2.1, signaling profound shifts in family structures and demographic futures."
        chartType="fertilityTrends"
        data={fertilityTrendsData}
        index={14}
      />

      <VisualizationSection
        title="Distribution of Key Indicators"
        description="Examine the distribution patterns of critical socioeconomic indicators across buffer countries. These histograms reveal the diversity and concentration of wealth, inequality, urbanization, fertility, mental health, and social protection across nations."
        chartType="indicatorDistributions"
        data={indicatorDistData}
        index={15}
      />

      <VisualizationSection
        title="Country Profiles: Multi-Dimensional View"
        description="Compare the multidimensional profiles of four representative countries from different global regions. These radar charts provide a holistic view of how nations balance competing development priorities and experience different trade-offs."
        chartType="countryProfiles"
        data={countryProfilesData}
        index={16}
      />

      <VisualizationSection
        title="Inequality Crisis: Wealth Concentration"
        description="Explore the relationship between income inequality (Gini Index) and wealth concentration in the top 10%. This visualization reveals how unequal societies tend to concentrate wealth at the very top, creating economic divides."
        chartType="inequalityCrisis"
        data={inequalityCrisisData}
        index={17}
      />

      <VisualizationSection
        title="Social Atomization: Household Structure vs GDP"
        description="Examine how the rise of single-person households correlates with economic development. This chart captures the fragmentation of traditional family structures in wealthier, more developed societies."
        chartType="socialAtomization"
        data={socialAtomizationData}
        index={18}
      />

      <VisualizationSection
        title="Debt Trap: Household Debt vs Economic Output"
        description="Visualize the burden of household debt relative to GDP per capita. High debt levels can trap households in economic precarity, limiting their ability to invest in the future and contributing to broader societal strain."
        chartType="debtTrap"
        data={debtTrapData}
        index={19}
      />

      <VisualizationSection
        title="Ideal Comparative Analysis"
        description="Explore and compare countries across multiple development and social metrics. Use the dropdown menu to switch between different indicators and see how nations rank against each other in various dimensions of progress."
        chartType="idealComparative"
        data={idealComparativeData}
        index={20}
      />

      <VisualizationSection
        title="Positive Drivers of Wellbeing"
        description="Discover the factors that most strongly correlate with higher wellbeing scores. These horizontal bars reveal which social, economic, and environmental indicators have the greatest positive impact on human flourishing."
        chartType="wellbeingBestPredictors"
        data={wellbeingBestData}
        index={21}
      />

      <VisualizationSection
        title="Negative Drivers of Wellbeing"
        description="Identify the factors that correlate most strongly with lower wellbeing. Understanding these detractors—from inequality to social isolation—helps us recognize the pressures that diminish quality of life across societies."
        chartType="wellbeingWorstPredictors"
        data={wellbeingWorstData}
        index={22}
      />

      {/* Thank You Section */}
      <ThankYouSection />
    </div>
  );
};

export default App;
