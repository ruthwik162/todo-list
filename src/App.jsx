import { useState, useEffect, useMemo } from "react";
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
import AppLoadingScreen from "./components/AppLoadingScreen";

function App() {
  const [todos, setTodos] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === null ? window.matchMedia('(prefers-color-scheme: dark)').matches : savedMode === "true";
  });
  const [user, loading] = useAuthState(auth);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  // Glass morphism effect colors
  const glassBg = darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)';
  const glassBorder = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const glassShadow = darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)';

  // Stable background elements with useMemo
  const floatingElements = useMemo(() => {
    const count = window.innerWidth < 768 ? 8 : 15;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * (window.innerWidth < 768 ? 100 : 200) + 50,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 15 + 10,
      xMovement: Math.random() * 100 - 50,
      yMovement: Math.random() * 100 - 50,
      opacityRange: [0.1, 0.2 + Math.random() * 0.2]
    }));
  }, []);

  // Fetch todos
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "todos"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const todosData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        todosData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        setTodos(todosData);
      });
      return () => unsubscribe();
    } else {
      setTodos([]);
    }
  }, [user]);

  // Add new todo with character limit
  const addTodo = async (text) => {
    if (!user) return;
    if (text.trim().length > 200) {
      toast.error("Task must be less than 200 characters");
      return;
    }
    try {
      await addDoc(collection(db, "todos"), {
        text,
        completed: false,
        createdAt: Timestamp.now(),
        userId: user.uid,
      });
      toast.success("Task added successfully!");
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Failed to add task");
    }
  };

  // Toggle complete with optimistic UI
  const completeTodo = async (id) => {
    try {
      const todoRef = doc(db, "todos", id);
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        setTodos(prev => prev.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ));
        await updateDoc(todoRef, { completed: !todo.completed });
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update task");
      // Revert on error
      setTodos(prev => prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    }
  };

  // Delete todo with confirmation
  const deleteTodo = async (id) => {
    try {
      const todoText = todos.find(t => t.id === id)?.text || "this task";
      if (window.confirm(`Are you sure you want to delete "${todoText}"?`)) {
        await deleteDoc(doc(db, "todos", id));
        toast.success("Task deleted");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete task");
    }
  };

  // Dark mode toggle with system preference fallback
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  // Google Sign-In with better error handling
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success(`Welcome back, ${result.user.displayName || 'User'}!`, {
        icon: '👋',
      });
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error(`Sign-In Error: ${error.message.split('.')[0]}`);
    }
  };

  // Show loading screen for minimum 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Set initial dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const decorativeElements = useMemo(() => {
    const count = window.innerWidth < 768 ? 8 : 15;
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * (window.innerWidth < 768 ? 100 : 200) + 50;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const xMovement = Math.random() * 100 - 50;
      const duration = Math.random() * 15 + 10;

      return {
        id: i,
        size,
        left,
        top,
        xMovement,
        duration
      };
    });
  }, []);

  return (
    <>
      {showLoadingScreen ? (
        <AppLoadingScreen darkMode={darkMode} />
      ) : (
        <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-indigo-150 to-violet-150"}`}>
          {/* Reverted to previous decorative elements style */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {decorativeElements.map((element) => (
              <motion.div
                key={element.id}
                className="absolute rounded-full opacity-10"
                style={{
                  width: element.size,
                  height: element.size,
                  left: `${element.left}%`,
                  top: `${element.top}%`,
                  background: darkMode ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)',
                }}
                animate={{
                  y: [0, -100],
                  x: [0, element.xMovement],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: element.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <Toaster
            position={window.innerWidth < 768 ? "top-right" : "top-center"}
            toastOptions={{
              style: {
                background: darkMode ? '#1e293b' : '#ffffff',
                color: darkMode ? '#ffffff' : '#1e293b',
                backdropFilter: 'blur(10px)',
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                fontSize: window.innerWidth < 768 ? '14px' : '16px',
                maxWidth: window.innerWidth < 768 ? '80vw' : '100%',
              },
            }}
          />

          <div className="container mx-auto md:mt-20 max-w-9xl w-full px-4 py-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="md:max-w-3xl mx-auto w-full px-2 sm:px-0"
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
                      className="p-4 sm:p-6"
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
                      className="text-center p-6 sm:p-12"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h2 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                          TaskMaster Pro
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
                          Organize your life with style
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleGoogleSignIn}
                          className="relative overflow-hidden group flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 mx-auto shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                          <motion.span
                            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                            style={{ borderRadius: '9999px' }}
                          />
                          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 sm:w-5 h-4 sm:h-5" />
                          <span className="font-medium">Sign In with Google</span>
                          <motion.span
                            className="absolute right-2 sm:right-4 opacity-0 group-hover:opacity-100 group-hover:right-3 sm:group-hover:right-6 transition-all duration-300"
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
      )}
    </>
  );
}

export default App;