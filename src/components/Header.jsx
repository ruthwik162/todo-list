import { FiList, FiSun, FiMoon, FiLogOut, FiUser, FiCircle } from 'react-icons/fi';
import { auth } from '../firebase';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

const Header = ({ darkMode, toggleDarkMode, user }) => {
  const controls = useAnimation();
  const gradientControls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" }
      });

      // Continuous subtle floating animation
      controls.start({
        transition: {
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      });
    };

    sequence();

    // Gradient animation
    gradientControls.start({
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const userName = user?.displayName || 'User';
  const userPhoto = user?.photoURL;
  const userInitials = getInitials(userName);

  return (
    <div className="flex items-center justify-between p-4 sm:p-6">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={controls}
        className="flex items-center"
      >
        <motion.div
          whileHover={{ rotate: 15 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FiList className="text-indigo-500 text-2xl sm:text-3xl mr-2 sm:mr-3" />
        </motion.div>
        <motion.h1
          className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef, #6366f1)',
            backgroundSize: '300% 100%'
          }}
          animate={gradientControls}
        >
          TaskMaster
        </motion.h1>
      </motion.div>

      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={controls}
        className="flex items-center space-x-2 sm:space-x-4"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="p-1 sm:p-2 rounded-full backdrop-blur-md bg-white/10 cursor-pointer dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 border border-white/20 dark:border-black/20 shadow-lg hover:shadow-xl transition-all"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <motion.div
              initial={{ scale: 0.8, rotate: 0 }}
              animate={{
                scale: [0.8, 1.1, 1],
                transition: {
                  duration: 1.5,
                  ease: "easeInOut"
                }
              }}
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.3 }
              }}
              whileTap={{
                scale: 0.9,
                rotate: 720,
                transition: {
                  duration: 1,
                  ease: "easeOut"
                }
              }}
              className="relative"
            >
              <FiSun className="text-yellow-400 text-lg sm:text-xl" />
              {/* Sun rays */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-4 w-1 bg-yellow-400/50 rounded-full"
                    style={{
                      transformOrigin: '0 150%',
                      transform: `rotate(${i * 45}deg) translateY(-10px)`
                    }}
                    animate={{
                      opacity: [0.3, 0.7, 0.3],
                      scaleY: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, rotate: -30 }}
              animate={{
                scale: [0.8, 1.1, 1],
                rotate: [-30, -190, -340],
                transition: {
                  duration: 2,
                  ease: "easeInOut"
                }
              }}
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.3 }
              }}
              whileTap={{
                scale: 0.9,
                rotate: -720,
                transition: {

                  duration: 1,
                  ease: "easeOut"
                }
              }}
              className="relative"
            >
              <FiMoon className="text-indigo-300 text-lg sm:text-xl" />
              {/* Stars */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gray-600/60 rounded-full"
                  style={{
                    top: `${Math.random() * 30 - 15}px`,
                    left: `${Math.random() * 30 - 15}px`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5]
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          )}

        </motion.button>

        {user && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            {userPhoto ? (
              <motion.div
                className="relative"
              >
                <FiUser
                  className={`w-8 h-8 sm:w-10 sm:h-10 ${darkMode ? "text-white" : "text-black"} transition-colors duration-300`}
                />
                {/* Pulsing active dot indicator */}
                <motion.span
                  className="absolute top-0 right-0"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: 1,
                    backgroundColor: darkMode ? '#10B981' : '#10B981'
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut'
                  }}
                  style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    borderRadius: '9999px',
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white font-medium relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-80"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <span className="relative z-10 text-sm sm:text-base">{userInitials}</span>
              </motion.div>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSignOut}
              className="p-1 sm:p-2 rounded-full cursor-pointer backdrop-blur-md bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 border border-white/20 dark:border-black/20 shadow-lg hover:shadow-xl transition-all"
              aria-label="Sign out"
            >
              <FiLogOut className="text-red-400 text-lg sm:text-xl" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Header;