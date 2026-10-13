import { motion } from 'framer-motion'

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white grid-paper">
      <div className="relative flex flex-col items-center">
        {/* Animated Logo Container */}
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ 
            scale: [0.8, 1.1, 1],
            rotate: [-10, 10, 0]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 md:w-32 md:h-32 bg-white border-4 border-black shadow-brutal flex items-center justify-center mb-8"
        >
          <img src="/logo.png" alt="GDG Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
        </motion.div>

        {/* Text Animation */}
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="text-2xl md:text-3xl font-headline font-black uppercase tracking-tighter text-black"
          >
            GDG SKNCOE
          </motion.h2>
        </div>

        {/* Loading Bar */}
        <div className="w-48 h-3 bg-white border-2 border-black mt-6 relative overflow-hidden shadow-brutal-sm">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-primary"
          />
        </div>

        {/* Desktop Experience Notice */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-black/40 leading-tight">
            For Better Experience <br className="md:hidden" /> view in Desktop Mode
          </p>
        </motion.div>

        {/* Floating shapes for brutalist feel */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-12 h-12 bg-warning border-4 border-black hidden md:block"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -45, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -bottom-20 -right-20 w-16 h-16 bg-success border-4 border-black hidden md:block shadow-brutal-sm"
        />
      </div>
    </div>
  )
}

export default Loader
