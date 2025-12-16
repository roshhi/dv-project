import React from 'react';
import { motion } from 'framer-motion';


const ThankYouSection = () => {
  return (
    <section className="min-h-screen w-full snap-start relative bg-[#020617] text-slate-200 overflow-hidden flex items-center justify-center py-20">
      {/* Abstract Background - Data Flow Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-indigo-900/40 to-transparent" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-indigo-900/40 to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-900/20 to-transparent" />
        
        {/* Glowing Orbs - subtle and dark */}
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <span className="text-indigo-400/80 font-mono text-xs tracking-[0.2em] uppercase mb-8 block">Project Conclusion</span>

          {/* Profile Card */}


          <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight mb-8">
            Any <span className="font-medium bg-gradient-to-r from-indigo-200 via-white to-purple-200 bg-clip-text text-transparent">Questions?</span>
          </h1>

          <p className="text-slate-400 leading-relaxed font-light text-xl md:text-2xl max-w-3xl mx-auto mb-16">
            We hope this data visualization helped illuminate the complex relationship between 
            economic development and societal wellbeing. The patterns we've uncovered challenge 
            conventional wisdom and invite deeper reflection.
          </p>

          <div className="flex flex-col items-center gap-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.querySelector('section').scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
              className="px-8 py-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-indigo-300 font-medium hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 flex items-center gap-2 group"
            >
              <span>Back to Introduction</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-slate-600 text-sm font-light tracking-wide flex items-center gap-4"
            >
              <span>Data sources: World Bank, OECD, UN</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span>React & Chart.js</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ThankYouSection;
