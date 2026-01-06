import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect } from 'react'
import Hero from './Hero.jsx'
import WaveEffect from './WaveEffect.jsx'
import WillowBranch from './WillowBranch.jsx'
import goldCambridgeImg from './gold-cambridge.webp'

// 诗歌内容直接硬编码
const VERSES = [
    [
        "轻轻的我走了，",
        "正如我轻轻的来；",
        "我轻轻的招手，",
        "作别西天的云彩。"
    ],
    [
        "那河畔的金柳，",
        "是夕阳中的新娘；",
        "波光里的艳影，",
        "在我的心头荡漾。"
    ],
    [
        "软泥上的青荇，",
        "油油的在水底招摇；",
        "在康河的柔波里，",
        "我甘心做一条水草！"
    ],
    [
        "那榆荫下的一潭，",
        "不是清泉，",
        "是天上虹；",
        "揉碎在浮藻间，",
        "沉淀着彩虹似的梦。"
    ],
    [
        "寻梦？撑一支长篙，",
        "向青草更青处漫溯；",
        "满载一船星辉，",
        "在星辉斑斓里放歌。"
    ],
    [
        "但我不能放歌，",
        "悄悄是别离的笙箫；",
        "夏虫也为我沉默，",
        "沉默是今晚的康桥！"
    ],
    [
        "悄悄的我走了，",
        "正如我悄悄的来；",
        "我挥一挥衣袖，",
        "不带走一片云彩。"
    ]
]

export default function Content({ onBack }) {
    const containerRef = useRef(null)
    const scrollContainerRef = useRef(null)

    // 在挂载后获取滚动容器
    useEffect(() => {
        scrollContainerRef.current = document.querySelector('.content-scroll-area')
    }, [])

    const { scrollYProgress } = useScroll({
        target: containerRef,
        container: scrollContainerRef,
        offset: ['start start', 'end end'],
    })

    // Parallax elements
    const starOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1])
    const willowOpacity = useTransform(scrollYProgress, [0.4, 0.55], [1, 0])

    return (
        <article ref={containerRef} className="relative min-h-[200vh] bg-[#F5F5F5] overflow-hidden">
            {/* Background Layers - Moved to top to be behind content */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#E0F7FA] via-[#Eeffe0] to-[#FFE0B2] opacity-50"></div>

                {/* Interactive Wave Effect */}
                <WaveEffect />

                {/* Stars overlay */}
                <motion.div style={{ opacity: starOpacity }} className="absolute inset-0 bg-[#1a237e] mix-blend-multiply pointer-events-none transition-colors duration-1000" />

                {/* Decorative Willows (Foreground) */}
                <motion.div style={{ opacity: willowOpacity }} className="hidden md:block">
                    <WillowBranch delay={0} xOffset={0} />
                </motion.div>
            </div>

            {/* 返回按钮 */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="fixed top-6 left-6 z-50 px-4 py-2 bg-white/80 hover:bg-white rounded-full shadow-lg text-[#2C3E50] font-medium transition-colors"
                >
                    ← 返回
                </button>
            )}

            <Hero />


            <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 md:py-32 space-y-32">
                {VERSES.map((verse, index) => (
                    <Section key={index} index={index}>
                        <div className="text-center space-y-6 cursor-default">
                            {verse.map((line, i) => (
                                <FloatingText
                                    key={i}
                                    className={`text-xl md:text-2xl font-serif leading-loose transition-colors duration-500 ${index >= 3 ? 'text-white/90 drop-shadow-md' : 'text-[#2C3E50]'
                                        } ${index === 4 ? 'text-[#FFD700]/90' : ''
                                        }`}
                                >
                                    {line}
                                </FloatingText>
                            ))}
                            {index === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 0.8, scale: 1 }}
                                    transition={{ duration: 1.2 }}
                                    className="relative w-[75vw] h-[40vw] md:h-[500px] left-1/2 -translate-x-1/2 mt-12"
                                >
                                    <img
                                        src={goldCambridgeImg}
                                        alt="Gold Cambridge"
                                        className="object-contain drop-shadow-xl w-full h-full"
                                        style={{
                                            maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 95%)',
                                            WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 95%)'
                                        }}
                                    />
                                </motion.div>
                            )}
                        </div>

                        {/* Contextual Visuals */}
                        {index === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="absolute top-0 right-full mr-4 w-32 h-32 bg-white/40 blur-3xl rounded-full"
                            />
                        )}
                        {/* Removed static willow text, dynamic willow is now global */}
                        {index === 2 && (
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2E8B57] to-transparent"></div>
                            </div>
                        )}
                        {/* Night Particles - Spread across indices 4, 5, 6 */}
                        {index === 4 && (
                            <motion.div
                                className="absolute left-[5%] top-[-10%] w-16 h-16 bg-[#4DD0E1] rounded-full blur-2xl opacity-40"
                                animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
                                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                            />
                        )}
                        {index === 5 && (
                            <>
                                <motion.div
                                    className="absolute left-[-5%] top-10 w-24 h-24 bg-[#FFD700] rounded-full blur-3xl opacity-40"
                                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                                <motion.div
                                    className="absolute left-[10%] top-[-20%] w-16 h-16 bg-[#4DD0E1] rounded-full blur-2xl opacity-50"
                                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                                />
                                {/* New Right-side Particles */}
                                <motion.div
                                    className="absolute right-[-5%] top-20 w-20 h-20 bg-[#FFD700] rounded-full blur-2xl opacity-40"
                                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
                                    transition={{ duration: 3.5, repeat: Infinity, delay: 0.2 }}
                                />
                                <motion.div
                                    className="absolute right-[10%] bottom-[-20%] w-14 h-14 bg-[#00CED1] rounded-full blur-xl opacity-50"
                                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2.8, repeat: Infinity, delay: 0.7 }}
                                />
                            </>
                        )}
                        {index === 6 && (
                            <>
                                <motion.div
                                    className="absolute right-[15%] top-[-20%] w-20 h-20 bg-[#FFAB40] rounded-full blur-2xl opacity-30"
                                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 3.2, repeat: Infinity, delay: 0.2 }}
                                />
                                <motion.div
                                    className="absolute left-[20%] bottom-10 w-12 h-12 bg-[#FFD700] rounded-full blur-xl opacity-40"
                                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.3, 1] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
                                />
                            </>
                        )}
                    </Section>
                ))}
            </div>

            <div className="h-[20vh] flex items-center justify-center text-[#2C3E50]/50 font-serif pb-20">
                ~ 完 ~
            </div>
        </article>
    )
}

function Section({ children, index }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-10%" }}
            className="relative min-h-[60vh] flex items-center justify-center py-10"
        >
            {children}
        </motion.section>
    )
}

function FloatingText({ children, className }) {
    return (
        <motion.p
            className={className}
            whileHover={{
                y: -5,
                textShadow: "0px 5px 10px rgba(0,0,0,0.1)",
                scale: 1.02
            }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {children}
        </motion.p>
    )
}
