import { FiTrash2, FiCheck, FiCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const TodoItem = ({ todo, onComplete, onDelete, darkMode }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 30 } }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
      whileHover={{ y: -2, scale: 1.02 }}
      className={`group flex items-center justify-between p-4 my-3 rounded-2xl
        ${todo.completed 
          ? 'bg-green-100 dark:bg-green-800' 
          : darkMode 
            ? 'bg-gray-700' 
            : 'bg-white'} 
        border ${darkMode ? 'border-gray-500' : 'border-gray-200'} shadow-md transition-all duration-200`}
    >
      <div className="flex items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onComplete(todo.id)}
          className={`relative flex items-center justify-center w-8 h-8 rounded-full mr-3 transition-all
            ${todo.completed 
              ? 'bg-green-500 text-white' 
              : 'border-2 border-gray-400 dark:border-gray-500 hover:border-indigo-500/70'}`}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <AnimatePresence mode="wait">
            {todo.completed ? (
              <motion.div
                key="check"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <FiCheck className="text-white text-sm" />
              </motion.div>
            ) : (
              <motion.div
                key="circle"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <FiCircle className={`text-indigo-600 dark:text-indigo-400 text-sm opacity-100`} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.span 
          className={`${todo.completed 
            ? 'line-through text-gray-700 dark:text-gray-300' 
            : darkMode 
              ? 'text-gray-200' 
              : 'text-gray-800'} break-words`}
          initial={{ x: 0 }}
          animate={{ x: todo.completed ? 5 : 0 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {todo.text}
        </motion.span>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(todo.id)}
        className={`p-2 rounded-full transition-all
          ${darkMode 
            ? 'bg-red-800/30 hover:bg-red-700/50 border border-red-600' 
            : 'bg-red-100 hover:bg-red-200 border border-red-400'} shadow-md`}
        aria-label="Delete task"
      >
        <FiTrash2 className={`${darkMode ? 'text-red-400' : 'text-red-600'} text-base`} />
      </motion.button>
    </motion.div>
  );
};

export default TodoItem;
