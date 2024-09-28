import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

const HeroSection = () => {
  const [text] = useTypewriter({
    words: ['Machine Learning', 'Data Science', 'AI'],
    loop: 0,
  });

  return (
    <motion.section 
      className="relative bg-gray-900 text-white py-32 md:py-48 lg:py-64 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://assets.api.uizard.io/api/cdn/stream/afa14da4-5966-4386-bf78-6707e049da86.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Revolutionize How You Learn <br />
          <span className="text-blue-400">{text}</span>
          <Cursor cursorColor='white' />
        </h1>
        <motion.p 
          className="text-xl mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Generate customized, interactive Jupyter notebooks
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105">
            Get Started
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;