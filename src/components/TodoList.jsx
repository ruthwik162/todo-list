import TodoItem from './TodoItem';
import { FiInbox } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const TodoList = ({ todos, onComplete, onDelete, darkMode }) => {
  return (
    <div className="mt-2 px-2">
      <AnimatePresence>
        {todos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 flex flex-col items-center"
          >
            <FiInbox className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} text-5xl mb-4`} />
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No tasks yet. Add one above!</p>
          </motion.div>
        ) : (
          <motion.div layout className="space-y-2">
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default TodoList;