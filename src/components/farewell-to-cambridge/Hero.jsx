import { motion } from 'framer-motion'
import heroImage from './farewell-to-cambridge.webp'

export default function Hero() {
    return (
        <div className="relative w-full h-auto overflow-hidden">
            {/* 背景图片 - 渐入动画 */}
            <motion.div
                className="relative w-full h-auto"
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <img
                    src={heroImage}
                    alt="再别康桥"
                    className="w-full h-auto"
                />
            </motion.div>
        </div>
    )
}
