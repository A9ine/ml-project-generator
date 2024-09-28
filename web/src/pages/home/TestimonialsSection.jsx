import React from 'react';
import { motion } from 'framer-motion';
import user1 from '../../images/user1.jpeg';
import user2 from '../../images/user2.jpeg';
import user3 from '../../images/user3.jpeg';

const TestimonialsSection = () => (
  <section className="bg-gray-100 py-16">
    <div className="container mx-auto px-4">
      <motion.h2 
        className="text-3xl font-bold mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Testimonials
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TestimonialCard
          name="Callum Gay"
          image={user1}
          quote="MLNotebookGen has revolutionized how I learn ML concepts. The customized projects and real datasets make practice so much more engaging!"
        />
        <TestimonialCard
          name="Minecraft Enjoyer"
          image={user2}
          quote="The customization options are endless. I love how intuitive and user-friendly the platform is."
        />
        <TestimonialCard
          name="Asian Boy"
          image={user3}
          quote="As a beginner, the interactive coding experience with guidance has boosted my confidence in tackling complex ML topics. It's like having a personal tutor!"
        />
      </div>
    </div>
  </section>
);

const TestimonialCard = ({ name, image, quote }) => (
  <motion.div 
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex items-center mb-4">
      <img src={image} alt={name} className="w-16 h-16 rounded-full mr-4 object-cover" />
      <h3 className="text-xl font-semibold">{name}</h3>
    </div>
    <p className="text-gray-600 italic">"{quote}"</p>
  </motion.div>
);

export default TestimonialsSection;