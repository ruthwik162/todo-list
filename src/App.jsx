import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, Timestamp } from "firebase/firestore";
import { db, auth, provider } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithPopup } from "firebase/auth";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import Header from "./components/Header";
import { FiLoader } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [todos, setTodos] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [user, loading] = useAuthState(auth);
  const [appLoading, setAppLoading] = useState(true);

  // Glass morphism effect colors
  const glassBg = darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)';
  const glassBorder = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const glassShadow = darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)';

  // Fetch todos
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "todos"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const todosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        todosData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        setTodos(todosData);
        setAppLoading(false);
      });
      return () => unsubscribe();
    } else {
      setTodos([]);
      setAppLoading(false);
    }
  }, [user]);

  // Add new todo
  const addTodo = async (text) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "todos"), {
        text,
        completed: false,
        createdAt: Timestamp.now(),
        userId: user.uid,
      });
      toast.success("Task added!");
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Failed to add task");
    }
  };

  // Toggle complete
  const completeTodo = async (id) => {
    try {
      const todoRef = doc(db, "todos", id);
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        await updateDoc(todoRef, { completed: !todo.completed });
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update task");
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete task");
    }
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success(`Welcome, ${result.user.displayName || 'User'}!`);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error(`Sign-In Error: ${error.message}`);
    }
  };

  // Loading screen
  if (loading || appLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 1.5,
            ease: "linear"
          }}
        >
          <FiLoader className="text-5xl text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-indigo-50 to-purple-50"}`}>
      {/* Animated floating shapes background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: darkMode ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)',
            }}
            animate={{
              y: [0, -100],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: darkMode ? '#1e293b' : '#ffffff',
            color: darkMode ? '#ffffff' : '#1e293b',
            backdropFilter: 'blur(10px)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md mx-auto"
        >
          <div 
            className="rounded-3xl overflow-hidden backdrop-blur-lg"
            style={{
              background: glassBg,
              border: `1px solid ${glassBorder}`,
              boxShadow: glassShadow,
            }}
          >
            <Header user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            
            <AnimatePresence mode="wait">
              {user ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <TodoForm onAdd={addTodo} darkMode={darkMode} />
                  <TodoList 
                    todos={todos} 
                    onComplete={completeTodo} 
                    onDelete={deleteTodo} 
                    darkMode={darkMode}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="text-center p-12"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                      TaskMaster Pro
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Organize your life with style
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGoogleSignIn}
                      className="relative overflow-hidden group flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-full transition-all duration-300 mx-auto shadow-lg hover:shadow-xl"
                    >
                      <motion.span 
                        className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                        style={{ borderRadius: '9999px' }}
                      />
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                      <span className="font-medium">Sign In with Google</span>
                      <motion.span 
                        className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:right-6 transition-all duration-300"
                        initial={{ x: -10 }}
                      >
                        →
                      </motion.span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;