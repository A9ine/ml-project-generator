import React from 'react';
import { Code, Database, BookOpen, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSection = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <motion.h2 
        className="text-3xl font-bold mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Features
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<Code className="w-12 h-12 text-blue-600" />}
          title="Customized ML Projects"
          description="Generate tailored projects based on your chosen topics and interests, using real-world datasets."
        />
        <FeatureCard
          icon={<Database className="w-12 h-12 text-blue-600" />}
          title="Relevant Datasets"
          description="Access web-scraped or pre-curated datasets that match your project theme for authentic learning experiences."
        />
        <FeatureCard
          icon={<BookOpen className="w-12 h-12 text-blue-600" />}
          title="Interactive Learning"
          description="Practice coding with guidance, explanations, and immediate access to solution code when needed."
        />
        <FeatureCard
          icon={<Cpu className="w-12 h-12 text-blue-600" />}
          title="GPU-Accelerated"
          description="Leverage NVIDIA AI Workbench for rapid project generation and enhanced performance."
        />
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </motion.div>
);

export default FeaturesSection;