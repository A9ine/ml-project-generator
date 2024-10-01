import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => (
  <footer className="bg-blue-100 pt-16 pb-8 relative">
    <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
      <svg className="relative block w-full h-16" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
      </svg>
    </div>
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap justify-between items-center">
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <motion.h3 
            className="text-2xl font-bold text-blue-600 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            MLNotebookGen
          </motion.h3>
          <p className="text-gray-600">Revolutionizing machine learning education</p>
        </div>
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((item, index) => (
              <motion.li 
                key={index}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <a href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                  {item}
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-1/3">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Connect With Us</h4>
          <div className="flex space-x-4">
            {[Github, Twitter, Linkedin].map((Icon, index) => (
              <motion.a
                key={index}
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon size={24} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-200 text-center">
        <p className="text-gray-600">&copy; {new Date().getFullYear()} MLNotebookGen. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;