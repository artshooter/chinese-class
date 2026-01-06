import { motion } from 'framer-motion'
import runtuImg from './runtu.webp'

export default function Hero({ inHome = false }) {
    return (
        <div className={`relative w-full overflow-hidden ${inHome ? 'h-[400px] rounded-2xl' : 'h-auto'}`}>
            <motion.div
                className={inHome ? "absolute inset-0 z-0" : "relative z-0 w-full h-auto"}
                initial={inHome ? false : { scale: 1.15 }}
                animate={inHome ? false : { scale: 1 }}
                transition={inHome ? undefined : { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <img
                    src={runtuImg}
                    alt="故乡"
                    className="object-cover w-full h-full"
                    style={!inHome ? { width: '100%', height: 'auto' } : { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </motion.div>
            {/* Gradient overlay for smooth transition */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-b from-transparent to-[#f0f0f4]" />
        </div>
    )
}
