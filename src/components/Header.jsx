import { FiList, FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';
import { auth } from '../firebase';
import { motion } from 'framer-motion';

const Header = ({ darkMode, toggleDarkMode, user }) => {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Get user initials for fallback avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Safe user data extraction
  const userName = user?.displayName || 'User';
  const userPhoto = user?.photoURL;
  const userInitials = getInitials(userName);

  return (
    <div className="flex items-center justify-between p-6">
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center"
      >
        <FiList className="text-indigo-500 text-3xl mr-3" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          TaskMaster
        </h1>
      </motion.div>
      
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-3"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <FiSun className="text-yellow-400 text-xl" />
          ) : (
            <FiMoon className="text-gray-600 text-xl" />
          )}
        </motion.button>
        
        {user && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-2"
          >
            {userPhoto ? (
              <motion.img 
                src={userPhoto}
                alt={userName}
                className="w-8 h-8 rounded-full border-2 border-indigo-500 object-cover"
                whileHover={{ scale: 1.1 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 rounded-full border-2 border-indigo-500 bg-indigo-500 flex items-center justify-center text-white font-medium"
              >
                {userInitials}
              </motion.div>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSignOut}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Sign out"
            >
              <FiLogOut className="text-red-500 text-xl" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Header;