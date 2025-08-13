import TodoItem from './TodoItem';
import { FiInbox } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const TodoList = ({ todos, onComplete, onDelete, darkMode }) => {
  return (
    <div className="mt-2 px-2 flex-1">
      {todos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12 flex flex-col items-center"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity
            }}
          >
            <FiInbox className={`${darkMode ? 'text-gray-600' : 'text-black/80'} text-5xl mb-4`} />
          </motion.div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-lg`}>
            No tasks yet. Add one above!
          </p>
          <motion.div
            className="mt-4 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '50%', opacity: 0.5 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </motion.div>
      ) : (
        // Scrollable container for todos
        <div
          className={`max-h-[60vh] overflow-y-auto pr-2 pb-2 scrollbar-thin 
            ${darkMode 
              ? 'scrollbar-thumb-indigo-600/60 scrollbar-track-gray-800/10' 
              : 'scrollbar-thumb-indigo-400/50 scrollbar-track-gray-100/20'} 
            rounded-xl transition-colors`}
        >
          <motion.div layout className="space-y-3 px-2">
            <AnimatePresence>
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onComplete={onComplete}
                  onDelete={onDelete}
                  darkMode={darkMode}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
