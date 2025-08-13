import { FiList, FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';
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
        y: [0, -5, 0],
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
    <div className="flex items-center justify-between p-6">
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={controls}
        className="flex items-center"
      >
        <motion.div
          whileHover={{ rotate: 15 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FiList className="text-indigo-500 text-3xl mr-3" />
        </motion.div>
        <motion.h1 
          className="text-3xl font-bold bg-clip-text text-transparent"
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
        className="flex items-center space-x-4"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="p-2 rounded-full backdrop-blur-md bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 border border-white/20 dark:border-black/20 shadow-lg hover:shadow-xl transition-all"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <motion.div
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <FiSun className="text-yellow-400 text-xl" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ rotate: -15 }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "mirror",
                duration: 3,
                ease: "easeInOut"
              }}
            >
              <FiMoon className="text-indigo-300 text-xl" />
            </motion.div>
          )}
        </motion.button>
        
        {user && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-3"
          >
            {userPhoto ? (
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="relative"
              >
                <FiUser className='w-10 h-10'  />

              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium relative overflow-hidden"
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
                <span className="relative z-10">{userInitials}</span>
              </motion.div>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSignOut}
              className="p-2 rounded-full backdrop-blur-md bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 border border-white/20 dark:border-black/20 shadow-lg hover:shadow-xl transition-all"
              aria-label="Sign out"
            >
              <FiLogOut className="text-red-400 text-xl" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Header;