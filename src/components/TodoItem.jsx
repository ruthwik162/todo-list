import { FiTrash2, FiCheck, FiCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const TodoItem = ({ todo, onComplete, onDelete, darkMode }) => {
  const handleComplete = (id) => {
    const willComplete = !todo.completed;
    onComplete(id);
    
    toast.success(
      willComplete ? 'Task completed!' : 'Task marked incomplete',
      {
        position: 'top-center',
        style: {
          background: darkMode ? '#1f2937' : '#fff',
          color: darkMode ? '#fff' : '#1f2937',
          boxShadow: darkMode ? '0 4px 10px rgba(0, 0, 0, 0.3)' : '0 4px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          padding: '12px 16px',
        }
      }
    );
  };

  const handleDelete = (id) => {
    onDelete(id);
    toast.error('Task deleted', {
      position: 'top-center',
      style: {
        background: darkMode ? '#1f2937' : '#fff',
        color: darkMode ? '#fff' : '#1f2937',
        boxShadow: darkMode ? '0 4px 10px rgba(0, 0, 0, 0.3)' : '0 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        padding: '12px 16px',
      }
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 30 } }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
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
          onClick={() => handleComplete(todo.id)}
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
                className="flex items-center"
              >
                <FiCheck className="text-white text-sm" />
                <span className="ml-1 text-xs sr-only">Done</span>
              </motion.div>
            ) : (
              <motion.div
                key="circle"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="flex items-center"
              >
                <FiCircle className={`text-indigo-600 dark:text-indigo-400 text-sm opacity-100`} />
                <span className="ml-1 text-xs sr-only">Pending</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="flex flex-col">
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
          <span className={`text-xs mt-1 ${todo.completed 
            ? 'text-green-600 dark:text-green-300' 
            : 'text-indigo-600 dark:text-indigo-300'}`}>
            {todo.completed ? 'Completed' : 'In Progress'}
          </span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleDelete(todo.id)}
        className={`p-2 rounded-full transition-all
          ${darkMode 
            ? 'bg-violet-800/30 hover:bg-red-700/50 border border-gray-600' 
            : 'bg-gray-100 hover:bg-red-200 border border-violet-400'} shadow-md`}
        aria-label="Delete task"
      >
        <FiTrash2 className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-base`} />
      </motion.button>
    </motion.div>
  );
};

export default TodoItem;