import { motion } from 'framer-motion'
import Hero from './Hero.jsx'

export default function Content({ onBack }) {
    return (
        <div className="min-h-screen bg-[#FDFEFE] text-[#2F4F4F] font-serif">

            {/* 返回按钮 */}
            {onBack && (
                <motion.button
                    onClick={onBack}
                    className="fixed top-6 left-6 z-50 px-4 py-2 
                        bg-[#FDFEFE]/80 backdrop-blur-sm
                        border border-[#2F4F4F]/10
                        rounded-full shadow-sm
                        text-[#2F4F4F]/80 hover:text-[#2F4F4F] hover:bg-[#FDFEFE]
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

            {/* Hero: 面朝大海 */}
            <Hero />

            {/* 主内容区 */}
            <article className="max-w-3xl mx-auto px-6 py-20 md:py-32 space-y-32">

                {/* 第一节：从明天起 */}
                <Section>
                    <Stanza>
                        <Line text="从明天起，做一个幸福的人" />
                        <LineWithImage
                            text="喂马，劈柴，周游世界"
                            imageSrc="/src/components/facing-the-sea/hourse.webp"
                        />
                        <div className="mt-8">
                            <Line text="从明天起，关心粮食和蔬菜" />
                        </div>
                        <Line text="我有一所房子，面朝大海，春暖花开" emphasis />
                    </Stanza>
                </Section>

                {/* 第二节：幸福的闪电 */}
                <Section>
                    <Stanza>
                        <Line text="从明天起，和每一个亲人通信" />
                        <LineWithImage
                            text="告诉他们我的幸福"
                            imageSrc="/src/components/facing-the-sea/see-sea.webp"
                        />
                        <LightningLine text="那幸福的闪电告诉我的" />
                        <Line text="我将告诉每一个人" />
                    </Stanza>
                </Section>

                {/* 第三节：祝福（情感高潮） */}
                <Section className="py-8">
                    <motion.p
                        className="text-lg md:text-xl leading-loose text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        给每一条河每一座山取一个温暖的名字<br />
                        陌生人，我也为你祝福
                    </motion.p>

                    {/* 祝福卡片 */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center md:items-stretch">
                        <BlessingCard
                            text="愿你有一个灿烂的前程"
                            delay={0}
                        />
                        <BlessingCard
                            text="愿你有情人终成眷属"
                            delay={0.1}
                            className="md:mt-8"
                        />
                        <BlessingCard
                            text="愿你在尘世获得幸福"
                            delay={0.2}
                        />
                    </div>
                </Section>

                {/* 末句：我只愿 */}
                <Section className="min-h-[40vh] flex items-center justify-center">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <p className="text-2xl md:text-4xl leading-relaxed text-[#2F4F4F]/70 mb-4">
                            我只愿
                        </p>
                        <motion.img
                            src="/src/components/facing-the-sea/end.webp"
                            alt="面朝大海，春暖花开"
                            className="w-96 md:w-[30rem] h-auto object-cover rounded-2xl mt-4"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        />
                    </motion.div>
                </Section>

            </article>

            {/* 底部留白 - 海天渐变 */}
            <div className="h-48 bg-gradient-to-b from-[#FDFEFE] via-[#E0F2F9] to-[#87CEEB]" />

        </div>
    )
}

// ============ 子组件 ============

function Section({ children, className = '' }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: '-10%' }}
            className={`relative min-h-[50vh] flex flex-col items-center justify-center space-y-8 ${className}`}
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
            className={`text-lg md:text-xl leading-loose ${emphasis ? 'text-[#2F4F4F] font-medium' : 'text-[#2F4F4F]/80'}`}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
        >
            {text}
        </motion.p>
    )
}

function LineWithIcons({ text, icons }) {
    return (
        <motion.p
            className="text-lg md:text-xl leading-loose text-[#2F4F4F]/80 flex items-center justify-center gap-2 flex-wrap"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
        >
            <span>{text}</span>
            <span className="inline-flex gap-1 text-sm opacity-60">
                {icons.map((icon, i) => (
                    <span key={i} className="hover:scale-125 transition-transform cursor-default">
                        {icon}
                    </span>
                ))}
            </span>
        </motion.p>
    )
}

function LineWithImage({ text, imageSrc, emphasis = false }) {
    return (
        <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
        >
            <span className={`text-lg md:text-xl leading-loose ${emphasis ? 'text-[#2F4F4F] font-medium' : 'text-[#2F4F4F]/80'}`}>
                {text}
            </span>
            <motion.img
                src={imageSrc}
                alt=""
                className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl shadow-lg"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 300 }}
            />
        </motion.div>
    )
}

function LightningLine({ text }) {
    return (
        <motion.p
            className="text-lg md:text-xl leading-loose font-medium relative inline-block"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
            whileHover="hover"
        >
            <motion.span
                className="relative z-10"
                style={{ color: '#FFD700' }}
                variants={{
                    hover: {
                        textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
                    }
                }}
            >
                {text}
            </motion.span>
            {/* 闪电光晕装饰 */}
            <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent -z-10 rounded"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: [0, 1, 0], scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
            />
        </motion.p>
    )
}

function BlessingCard({ text, delay = 0, className = '' }) {
    return (
        <motion.div
            className={`
                relative px-8 py-6 bg-white rounded-2xl shadow-lg
                border border-[#87CEEB]/30
                cursor-default select-none
                group
                ${className}
            `}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay }}
            whileHover={{
                y: -8,
                boxShadow: '0 20px 40px rgba(135, 206, 235, 0.3), 0 0 60px rgba(255, 183, 197, 0.2)'
            }}
        >
            {/* 发光背景 */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFB7C5]/0 to-[#87CEEB]/0 group-hover:from-[#FFB7C5]/10 group-hover:to-[#87CEEB]/10 transition-all duration-500" />

            {/* 文字 */}
            <p className="relative z-10 text-lg md:text-xl text-[#2F4F4F] whitespace-nowrap">
                {text}
            </p>

            {/* 花朵装饰 */}
            <span className="absolute -top-2 -right-2 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                🌸
            </span>
        </motion.div>
    )
}
