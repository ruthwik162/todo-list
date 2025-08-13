import { FiTrash2, FiCheck, FiCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const TodoItem = ({ todo, onComplete, onDelete, darkMode }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`group flex items-center justify-between p-4 my-2 rounded-xl ${todo.completed ? 'bg-green-50/50 dark:bg-green-900/20' : darkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-200`}
    >
      <div className="flex items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onComplete(todo.id)}
          className={`flex items-center justify-center w-6 h-6 rounded-full mr-3 transition-all ${todo.completed ? 'bg-gradient-to-br from-green-400 to-green-500 text-white' : 'border-2 border-gray-300 dark:border-gray-500 hover:border-indigo-500'}`}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed ? <FiCheck className="text-sm" /> : <FiCircle className="text-sm opacity-0 group-hover:opacity-100 text-indigo-500" />}
        </motion.button>
        <motion.span 
          className={`${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}
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
        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Delete task"
      >
        <FiTrash2 />
      </motion.button>
    </motion.div>
  );
};

export default TodoItem;