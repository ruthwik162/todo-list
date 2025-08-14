import { useState, useRef, useEffect } from 'react';
import { FiPlus, FiSend } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const TodoForm = ({ onAdd, darkMode }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content with word-wrap
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200 // increased max height for more content
      )}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter key press (but allow Shift+Enter for new lines)
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  // Improved text handling with word wrapping
  const handleTextChange = (e) => {
    const value = e.target.value;
    // Optionally add word wrapping logic here if needed
    setText(value);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: "spring" }}
      className="mb-6 px-6"
    >
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className={`relative flex items-center transition-all duration-300 rounded-xl overflow-hidden
          ${isFocused ? 'ring-2 ring-indigo-500/50' : ''}`}
        style={{
          backdropFilter: 'blur(12px)',
          backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: darkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
            : '0 8px 32px rgba(99, 102, 241, 0.2)'
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Enter Your Task !!......"
          rows="3"
          className={`flex-grow p-4 pr-14 focus:outline-none bg-transparent 
            ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}
            scrollbar-hide overflow-y-auto max-h-[200px] whitespace-pre-wrap break-words`}
          style={{
            transition: 'height 0.2s ease-out',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}
          maxLength={1000} // Increased character limit
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute right-2 p-2 rounded-full cursor-pointer transition-all
            ${text.trim() 
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg' 
              : 'bg-white/20 dark:bg-black/20 text-gray-400'}`}
          disabled={!text.trim()}
          aria-label="Add todo"
          style={{
            backdropFilter: 'blur(4px)',
            bottom: textareaRef.current?.scrollHeight > 60 ? '0.5rem' : 'auto'
          }}
        >
          <AnimatePresence mode="wait">
            {text.trim() ? (
              <motion.div
                key="send"
                initial={{ rotate: -45, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 45, scale: 0.8 }}
              >
                <FiSend />
              </motion.div>
            ) : (
              <motion.div
                key="plus"
                initial={{ rotate: 90, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -90, scale: 0.8 }}
              >
                <FiPlus />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
      {text.length > 0 && (
        <div className={`text-xs mt-1 text-right px-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {text.length}/1000 characters
        </div>
      )}
    </motion.form>
  );
};

export default TodoForm;