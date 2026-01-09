import { motion } from 'framer-motion'
import heroImg from './peach-blossom-spring.webp'

export default function Hero() {
    return (
        <div className="relative w-full h-auto overflow-hidden bg-[#EDE8DC]">
            {/* 背景图片 - 渐入动画 */}
            <motion.div
                className="relative z-0 w-full h-auto"
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <img
                    src={heroImg}
                    alt="桃花源记"
                    className="w-full h-auto block"
                />
            </motion.div>

            {/* 底部渐变过渡 */}
            <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-b from-transparent to-[#EDE8DC]" />
        </div>
    )
}
