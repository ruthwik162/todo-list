import { useState } from 'react';
import { FiPlus, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';

const TodoForm = ({ onAdd, darkMode }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6 px-6"
    >
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className={`relative flex items-center transition-all duration-300 ${isFocused ? 'ring-2 ring-indigo-500' : ''} rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md overflow-hidden`}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What needs to be done?"
          className="flex-grow p-4 pr-12 rounded-xl bg-transparent focus:outline-none dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute right-2 p-2 rounded-full transition-all ${text.trim() ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}
          disabled={!text.trim()}
          aria-label="Add todo"
        >
          {text.trim() ? <FiSend /> : <FiPlus />}
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

export default TodoForm;