import { motion } from "framer-motion";
import { FiCheck, FiList, FiLoader } from "react-icons/fi";
import { useEffect, useState } from "react";

const AppLoadingScreen = ({ darkMode, onLoadingComplete }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Total animation duration is about 3 seconds
    const timer = setTimeout(() => {
      setIsAnimating(false);
      if (onLoadingComplete) onLoadingComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <motion.div
      className={`fixed inset-0 flex flex-col items-center justify-center transition-colors duration-500 z-50 ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-indigo-50 to-purple-50"
      }`}
      animate={isAnimating ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Todo Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-6 sm:mb-8"
      >
        <div
          className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shadow-xl flex items-center justify-center border-2 ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-indigo-100"
          }`}
        >
          {/* Notebook lines */}
          <div className="absolute w-full h-full left-0 top-0 overflow-hidden rounded-2xl">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-full h-px ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
                style={{ top: `${20 + i * 14}px`, left: 0 }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  delay: 0.3 + i * 0.1,
                  duration: 0.5,
                  type: "tween",
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Animated checkmarks */}
          <div className="relative z-10">
            <FiList
              className={`text-4xl sm:text-5xl ${
                darkMode ? "text-indigo-400" : "text-indigo-500"
              }`}
            />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 1, 0] }}
              transition={{
                delay: 1,
                duration: 0.8,
                times: [0, 0.3, 0.7, 1],
                ease: "easeInOut",
              }}
              className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
            >
              <FiCheck className="text-white text-xs" />
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 1, 0] }}
              transition={{
                delay: 1.3,
                duration: 0.8,
                times: [0, 0.3, 0.7, 1],
                ease: "easeInOut",
              }}
              className="absolute -bottom-2 -left-2 bg-blue-500 rounded-full p-1"
            >
              <FiCheck className="text-white text-xs" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* App Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2"
      >
        TaskMaster
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className={`text-sm sm:text-base text-gray-500 ${
          darkMode ? "dark:text-gray-400" : ""
        }`}
      >
        Organizing your tasks with style
      </motion.p>

      {/* Loading indicator */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "60%" }}
        transition={{ delay: 1, duration: 2, type: "tween" }}
        className={`mt-6 sm:mt-8 h-1.5 rounded-full overflow-hidden ${
          darkMode ? "bg-gray-700" : "bg-indigo-100"
        }`}
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
            repeatType: "loop",
          }}
          className="w-1/2 h-full bg-gradient-to-r from-indigo-400 to-purple-500"
        />
      </motion.div>

      {/* Spinning loader for slower connections */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, rotate: 360 }}
        transition={{
          delay: 2,
          opacity: { duration: 0.5 },
          rotate: {
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          },
        }}
        className="mt-6 text-indigo-500"
      >
        <FiLoader className="text-xl rounded-full" />
      </motion.div>
    </motion.div>
  );
};

export default AppLoadingScreen;