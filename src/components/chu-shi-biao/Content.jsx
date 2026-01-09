import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import heroImg from './chu-shi-biao.webp'
import sanGuMaoLuImg from './san-gu-mao-lu.webp'
import StoryCard from './StoryCard'
import { CHARACTERS } from './characters'

// === 文章正文内容 ===
const PARAGRAPHS = [
    { id: 1, text: "先帝创业未半而中道崩殂，今天下三分，益州疲弊，此诚危急存亡之秋也。然侍卫之臣不懈于内，忠志之士忘身于外者，盖追先帝之殊遇，欲报之于陛下也。诚宜开张圣听，以光先帝遗德，恢弘志士之气，不宜妄自菲薄，引喻失义，以塞忠谏之路也。" },
    { id: 2, text: "宫中府中，俱为一体；陟罚臧否，不宜异同。若有作奸犯科及为忠善者，宜付有司论其刑赏，以昭陛下平明之理，不宜偏私，使内外异法也。" },
    {
        id: 3,
        text: "侍中、侍郎郭攸之、费祎、董允等，此皆良实，志虑忠纯，是以先帝简拔以遗陛下。愚以为宫中之事，事无大小，悉以咨之，然后施行，必能裨补阙漏，有所广益。",
        character: CHARACTERS.feiyi,
        side: 'left'  // 费祎在左侧
    },
    {
        id: 4,
        text: "将军向宠，性行淑均，晓畅军事，试用于昔日，先帝称之曰能，是以众议举宠为督。愚以为营中之事，悉以咨之，必能使行阵和睦，优劣得所。",
        character: CHARACTERS.xiangchong,
        side: 'right'  // 向宠在右侧
    },
    { id: 5, text: "亲贤臣，远小人，此先汉所以兴隆也；亲小人，远贤臣，此后汉所以倾颓也。先帝在时，每与臣论此事，未尝不叹息痛恨于桓、灵也。侍中、尚书、长史、参军，此悉贞良死节之臣，愿陛下亲之信之，则汉室之隆，可计日而待也。", highlight: true },
    { id: 6, text: "臣本布衣，躬耕于南阳，苟全性命于乱世，不求闻达于诸侯。先帝不以臣卑鄙，猥自枉屈，三顾臣于草庐之中，咨臣以当世之事，由是感激，遂许先帝以驱驰。后值倾覆，受任于败军之际，奉命于危难之间，尔来二十有一年矣。", section: "三顾茅庐", image: sanGuMaoLuImg },
    { id: 7, text: "先帝知臣谨慎，故临崩寄臣以大事也。受命以来，夙夜忧叹，恐托付不效，以伤先帝之明；故五月渡泸，深入不毛。今南方已定，兵甲已足，当奖率三军，北定中原，庶竭驽钝，攘除奸凶，兴复汉室，还于旧都。此臣所以报先帝而忠陛下之职分也。至于斟酌损益，进尽忠言，则攸之、祎、允之任也。", section: "五月渡泸" },
    { id: 8, text: "愿陛下托臣以讨贼兴复之效，不效，则治臣之罪，以告先帝之灵。若无兴德之言，则责攸之、祎、允等之慢，以彰其咎；陛下亦宜自谋，以咨诹善道，察纳雅言，深追先帝遗诏。臣不胜受恩感激。今当远离，临表涕零，不知所言。", finale: true }
]



// === 灯火摇曳动画组件 ===
function FlickeringFlame() {
    return (
        <motion.div
            className="absolute w-3 h-6 rounded-full"
            style={{
                background: 'radial-gradient(ellipse at center bottom, #f59e0b 0%, #d97706 40%, transparent 80%)',
                filter: 'blur(1px)',
                boxShadow: '0 0 20px 10px rgba(245, 158, 11, 0.3), 0 0 40px 20px rgba(217, 119, 6, 0.2)'
            }}
            animate={{
                scaleY: [1, 1.2, 0.9, 1.1, 1],
                scaleX: [1, 0.9, 1.1, 0.95, 1],
                x: [-1, 1, -0.5, 0.5, 0],
                opacity: [1, 0.9, 1, 0.95, 1]
            }}
            transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
            }}
        />
    )
}

// === 光晕层（跟随滚动） ===
function SpotlightOverlay({ scrollProgress }) {
    // 光圈 Y 位置随滚动变化
    const spotlightY = useTransform(scrollProgress, [0, 1], ['30%', '70%'])

    return (
        <motion.div
            className="fixed inset-0 pointer-events-none z-30"
            style={{
                background: `radial-gradient(ellipse 60% 40% at 50% ${spotlightY}, transparent 0%, rgba(15, 23, 42, 0.7) 50%, rgba(15, 23, 42, 0.95) 100%)`
            }}
        />
    )
}

// === Hero 组件 ===
function Hero() {
    return (
        <section className="relative w-full h-auto overflow-hidden" style={{ backgroundColor: '#292524' }}>
            {/* 背景图片 - 必须有渐入动画 */}
            <motion.div
                className="relative z-0 w-full h-auto"
                initial={{ scale: 1.15, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <img
                    src={heroImg}
                    alt="出师表 - 诸葛亮灯下书写"
                    className="w-full h-auto block"
                />
            </motion.div>

            {/* 底部渐变过渡（与正文区域平滑衔接） */}
            <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-b from-transparent to-[#292524]" />

            {/* 向下滚动提示 */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-[#f59e0b] opacity-60"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <span className="text-sm tracking-widest mb-2">向下滚动</span>
                <span className="text-2xl">↓</span>
            </motion.div>
        </section>
    )
}

// === 段落组件 ===
function Paragraph({ paragraph, index }) {
    const isSectionHeader = paragraph.section
    const isHighlight = paragraph.highlight
    const isFinale = paragraph.finale
    const hasCharacter = !!paragraph.character

    return (
        <motion.div
            className={`
                relative py-8 md:py-12
                ${isSectionHeader ? 'mt-16' : ''}
                ${isFinale ? 'mt-20' : ''}
            `}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: index * 0.05 }}
        >
            {/* 章节图片 */}
            {paragraph.image && (
                <motion.div
                    className="mb-8 rounded-lg overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <img
                        src={paragraph.image}
                        alt={paragraph.section || ''}
                        className="w-full h-auto"
                    />
                </motion.div>
            )}

            {/* 章节标识 */}
            {isSectionHeader && (
                <div className="flex items-center justify-center gap-4 mb-8">
                    <span className="h-px w-12 bg-[#d97706]/30" />
                    <span className="text-[#d97706] text-sm tracking-[0.3em]">{paragraph.section}</span>
                    <span className="h-px w-12 bg-[#d97706]/30" />
                </div>
            )}

            {/* 正文 */}
            <p
                className={`
                    text-lg md:text-xl leading-[2.5] tracking-wide text-justify
                    ${isHighlight ? 'text-[#f59e0b] font-medium' : 'text-[#e5e7eb]'}
                    ${isFinale ? 'text-xl md:text-2xl text-center leading-[2.8] text-[#d97706]' : ''}
                `}
                style={{
                    textIndent: isFinale ? '0' : '2em',
                    fontFamily: '"Noto Serif SC", "Source Han Serif SC", serif'
                }}
            >
                {paragraph.text}
            </p>

            {/* 人物故事卡片（所有屏幕统一放在段落下方） */}
            {hasCharacter && (
                <div className="mt-6">
                    <StoryCard character={paragraph.character} />
                </div>
            )}
        </motion.div>
    )
}

// === 主内容组件 ===
export default function Content({ onBack }) {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: containerRef })

    return (
        <>
            <style>{`
                .chu-shi-biao-content::-webkit-scrollbar { display: none; }
                .chu-shi-biao-content { scrollbar-width: none; -ms-overflow-style: none; }
            `}</style>

            <div
                ref={containerRef}
                className="chu-shi-biao-content min-h-screen overflow-x-hidden"
                style={{ backgroundColor: '#292524' }}
            >
                {/* 返回按钮 */}
                {onBack && (
                    <motion.button
                        onClick={onBack}
                        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-[#1e293b]/80 hover:bg-[#334155] rounded-lg text-[#f3f4f6] text-sm transition-colors backdrop-blur-sm border border-[#334155]"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span>←</span>
                        <span>返回</span>
                    </motion.button>
                )}

                {/* Hero 部分 */}
                <Hero />

                {/* 聚光灯遮罩 */}
                <SpotlightOverlay scrollProgress={scrollYProgress} />

                {/* 正文内容区域 */}
                <article
                    className="relative z-40 max-w-3xl mx-auto px-6 md:px-8 py-16 md:py-24"
                    style={{ backgroundColor: 'transparent' }}
                >
                    {/* 奏折纹理背景（可选） */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{
                            backgroundImage: `repeating-linear-gradient(90deg, #f3f4f6 0px, #f3f4f6 1px, transparent 1px, transparent 40px)`
                        }}
                    />

                    {/* 段落渲染 */}
                    <div className="relative z-10">
                        {PARAGRAPHS.map((para, index) => (
                            <Paragraph key={para.id} paragraph={para} index={index} />
                        ))}
                    </div>
                </article>

                {/* 结尾：临表涕零 */}
                <footer className="relative z-40 py-24 text-center">
                    {/* 灯火渐弱的视觉暗示 */}
                    <motion.div
                        className="inline-block"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2 }}
                    >
                        <div className="w-2 h-3 mx-auto mb-8 rounded-full bg-[#d97706] opacity-30"
                            style={{ filter: 'blur(2px)' }}
                        />
                        <p className="text-xs tracking-[0.5em] text-[#6b7280]">
                            建兴五年 · 诸葛亮
                        </p>
                    </motion.div>
                </footer>
            </div>
        </>
    )
}
