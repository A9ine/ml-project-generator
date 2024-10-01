import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // const navItems = [
  //   { name: 'Home', href: '/' },
  //   { name: 'Features', href: '/features' },
  //   { name: 'Pricing', href: '/pricing' },
  //   { name: 'Contact', href: '/contact' },
  // ];

  return (
    <motion.header 
      className={`fixed w-full z-50 transition-all duration-300 bg-white bg-opacity-90 backdrop-blur-md ${
        isScrolled ? 'shadow-md' : ''
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* <img src="/api/placeholder/32/32" alt="MLNotebookGen Logo" className="w-8 h-8 mr-2" /> */}
              <span className="text-xl font-bold text-gray-800 text-shadow">MLNotebookGen</span>
            </motion.div>
          </Link>
          
          {/* <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <motion.li key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to={item.href} 
                    className="text-gray-700 hover:text-blue-600 transition-colors relative group text-sm font-medium text-shadow"
                  >
                    {item.name}
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav> */}
          
          <div className="md:hidden">
            <motion.button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.nav 
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* <ul className="bg-white shadow-lg py-2">
              {navItems.map((item) => (
                <motion.li 
                  key={item.name} 
                  whileHover={{ backgroundColor: '#f0f9ff' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    to={item.href} 
                    className="block py-2 px-4 text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul> */}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;