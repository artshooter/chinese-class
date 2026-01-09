import { motion } from 'framer-motion'
import backViewImg from './back-view.webp'

export default function Hero() {
    return (
        <div className="relative w-full h-auto bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] overflow-hidden">
            {/* 背景纹理 */}
            <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* 背景图片 - 渐入动画 */}
            <motion.div
                className="relative z-0 w-full h-auto"
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <img
                    src={backViewImg}
                    alt="Father's Back View"
                    className="w-full h-auto"
                />
            </motion.div>

            {/* 底部渐变过渡 */}
            <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-b from-transparent to-[#F5F5DC]" />
        </div>
    )
}
