'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import Hero from './Hero.jsx'
import shupathBg from './shupath.webp'
import carouselLeft from './left.webp'
import carouselRight from './right.webp'

export default function Content({ onBack, scrollContainerRef }) {
    const containerRef = useRef(null)
    const sectionRef = useRef(null)

    // 监听第一段正文位置，用于透明度
    const { scrollYProgress: sectionProgress } = useScroll({
        container: scrollContainerRef,
        target: sectionRef,
        layoutEffect: false,
        offset: ["start end", "end center"]
    })

    // 监听整个容器的滚动，用于轮播图
    const { scrollYProgress: containerProgress } = useScroll({
        container: scrollContainerRef,
        layoutEffect: false
    })

    const opacity = useTransform(sectionProgress, [0.4, 1], [0, 1])

    // 轮播图逻辑：根据整页滚动进度切换图片
    const carouselImages = [carouselLeft, carouselRight]
    const [carouselIndex, setCarouselIndex] = useState(0)

    // 轮播图位置：从底部向上移动（小幅度）
    const carouselY = useTransform(containerProgress, [0, 1], ['20%', '-13%'])
    const carouselX = useTransform(containerProgress, [0, 0.6, 1], ['0%', '18%', '4%'])

    // 轮播图缩放：随滚动逐渐变小（人物走远）
    const carouselScale = useTransform(containerProgress, [0, 1], [1.4, 0.3])
    const lastIndex = useRef(0)

    useMotionValueEvent(containerProgress, "change", (latest) => {
        console.log("Container Progress:", latest)
        // 将滚动进度映射到 0-1 索引，乘数越大切换越快
        const next = Math.floor(latest * 12) % 2
        if (next !== lastIndex.current) {
            lastIndex.current = next
            setCarouselIndex(next)
        }
    })

    useMotionValueEvent(sectionProgress, "change", (latest) => {
        console.log("Section Progress:", latest, "Opacity:", opacity.get())
    })

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-[#FDF5E6] text-[#2F4F4F] font-serif relative"
        >

            {/* 左侧装饰图 - 仅在桌面端显示 */}
            <motion.div
                style={{ opacity }}
                className="fixed inset-y-0 left-0 w-1/3 z-20 pointer-events-none hidden lg:flex items-center justify-center overflow-hidden px-12"
            >
                <div className="relative h-[85%] w-auto overflow-hidden rounded-lg">
                    {/* 主图 */}
                    <img
                        src={shupathBg}
                        alt="decoration main"
                        className="h-full w-auto object-contain shadow-2xl"
                        style={{
                            maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 95%)',
                            WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 95%)'
                        }}
                    />
                    {/* 轮播图叠加在主图上，随滚动从底部向上移动并缩小 */}
                    <motion.img
                        src={carouselImages[carouselIndex]}
                        alt={`carousel ${carouselIndex}`}
                        className="absolute inset-0 h-full w-full object-contain"
                        style={{
                            translateY: carouselY,
                            translateX: carouselX,
                            scale: carouselScale,
                            maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 95%)',
                            WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 95%)'
                        }}
                    />
                </div>
            </motion.div>

            {/* 内容层 - 确保在背景之上 */}
            <div className="relative z-10">

                {/* 返回按钮 */}
                {onBack && (
                    <motion.button
                        onClick={onBack}
                        className="fixed top-6 left-6 z-50 px-4 py-2 
                        bg-[#FDF5E6]/80 backdrop-blur-sm
                        border border-[#2F4F4F]/10
                        rounded-full shadow-sm
                        text-[#2F4F4F]/80 hover:text-[#2F4F4F] hover:bg-[#FDF5E6]
                        font-serif text-sm tracking-wide
                        cursor-pointer
                        transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        whileHover={{ x: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        ← 返回
                    </motion.button>
                )}

                {/* Hero: 蜀山之门 */}
                <Hero />

                {/* 顶部间距 - 放在 article 外部避免 space-y 影响 */}
                <div className="h-12 md:h-20" aria-hidden="true" />

                {/* 主内容区 */}
                <article className="max-w-3xl mx-auto px-6 pb-8 space-y-32">

                    {/* 第一段 */}
                    <div ref={sectionRef}>
                        <Section>
                            <Stanza>
                                <Line text="噫吁嚱，危乎高哉！" emphasis />
                                <RefrainLine text="蜀道之难，难于上青天！" />
                                <Line text="蚕丛及鱼凫，开国何茫然！" />
                                <Line text="尔来四万八千岁，不与秦塞通人烟。" />
                                <Line text="西当太白有鸟道，可以横绝峨眉巅。" />
                                <Line text="地崩山摧壮士死，然后天梯石栈相钩连。" />
                                <Line text="上有六龙回日之高标，下有冲波逆折之回川。" />
                                <Line text="黄鹤之飞尚不得过，猿猱欲度愁攀援。" />
                                <Line text="青泥何盘盘，百步九折萦岩峦。" />
                                <Line text="扪参历井仰胁息，以手抚膺坐长叹。" />
                            </Stanza>
                        </Section>
                    </div>

                    {/* 第二段 */}
                    <Section>
                        <Stanza>
                            <Line text="问君西游何时还？畏途巉岩不可攀。" />
                            <Line text="但见悲鸟号古木，雄飞雌从绕林间。" />
                            <Line text="又闻子规啼夜月，愁空山。" />
                            <RefrainLine text="蜀道之难，难于上青天，使人听此凋朱颜！" />
                            <Line text="连峰去天不盈尺，枯松倒挂倚绝壁。" />
                            <Line text="飞湍瀑流争喧豗，砯崖转石万壑雷。" />
                            <Line text="其险也如此，嗟尔远道之人胡为乎来哉！" />
                        </Stanza>
                    </Section>

                    {/* 第三段 */}
                    <Section>
                        <Stanza>
                            <Line text="剑阁峥嵘而崔嵬，" />
                            <Line text="一夫当关，万夫莫开。" emphasis />
                            <Line text="所守或匪亲，化为狼与豺。" />
                            <Line text="朝避猛虎，夕避长蛇，磨牙吮血，杀人如麻。" />
                            <Line text="锦城虽云乐，不如早还家。" />
                            <RefrainLine text="蜀道之难，难于上青天，侧身西望长咨嗟！" final />
                        </Stanza>
                    </Section>

                </article>

            </div>
        </div>
    )
}

// ============ 子组件 ============

function Section({ children }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: '-10%' }}
            className="relative"
        >
            {children}
        </motion.section>
    )
}

function Stanza({ children }) {
    return (
        <div className="space-y-4 text-center">
            {children}
        </div>
    )
}

function Line({ text, emphasis = false }) {
    return (
        <motion.p
            className={`text-lg md:text-xl leading-loose ${emphasis ? 'text-[#8B4513] font-medium' : 'text-[#2F4F4F]/90'}`}
            style={{ fontFamily: "'Noto Serif SC', 'Source Han Serif SC', serif" }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
        >
            {text}
        </motion.p>
    )
}

function RefrainLine({ text, final = false }) {
    return (
        <motion.p
            className={`text-xl md:text-2xl leading-loose font-bold my-8 ${final ? 'text-2xl md:text-3xl my-12' : ''}`}
            style={{
                fontFamily: "'Noto Serif SC', 'Source Han Serif SC', serif",
                color: '#8B4513'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8 }}
            whileHover={{
                textShadow: '0 0 20px rgba(139, 69, 19, 0.2)'
            }}
        >
            {text}
        </motion.p>
    )
}
