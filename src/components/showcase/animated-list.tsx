import React from 'react';
import { motion } from 'framer-motion';

export function AnimatedList() {
  const items = ['Apply', 'Get Matched', 'Enroll'];
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <motion.li
          key={item}
          className="text-offBlack dark:text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
        >
          {item}
        </motion.li>
      ))}
    </ul>
  );
}
