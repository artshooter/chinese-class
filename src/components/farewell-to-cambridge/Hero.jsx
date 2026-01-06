import { motion } from 'framer-motion'
import heroImage from './farewell-to-cambridge.webp'

export default function Hero({ inHome = false }) {
    const content = (
        <div className={`relative w-full overflow-hidden ${inHome ? 'h-[400px]' : 'h-auto'} group cursor-pointer`}>
            {/* Background Image */}
            <motion.div
                className={inHome ? "absolute inset-0" : "relative w-full h-auto"}
                initial={inHome ? false : { scale: 1.15 }}
                animate={inHome ? false : { scale: 1 }}
                transition={inHome ? undefined : { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <img
                    src={heroImage}
                    alt="再别康桥"
                    className="object-cover w-full h-full"
                    style={!inHome ? { width: '100%', height: 'auto' } : { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </motion.div>
        </div>
    )

    return content
}
