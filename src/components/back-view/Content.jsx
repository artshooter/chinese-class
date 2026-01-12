import { motion } from 'framer-motion'
import Hero from './Hero.jsx'
import orangeImg from './orange.webp'

export default function Content({ onBack }) {
    return (
        <div className="min-h-screen bg-[#F5F5DC] relative">
            {/* 纸张纹理 */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.08'/%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* 返回按钮 */}
            {onBack && (
                <motion.button
                    onClick={onBack}
                    className="fixed top-6 left-6 z-50 px-4 py-2 
                        bg-[#F5F5DC]/80 backdrop-blur-sm
                        border border-[#2C3E50]/10
                        rounded-full shadow-sm
                        text-[#2C3E50]/80 hover:text-[#2C3E50] hover:bg-[#F5F5DC]
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

            {/* Hero */}
            <Hero />

            {/* 开篇 */}
            <section className="max-w-3xl mx-auto px-6 py-16">
                <motion.p
                    className="text-xl md:text-2xl text-[#2C3E50] leading-relaxed text-center italic"
                    style={{ fontFamily: 'serif' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    我与父亲不相见已二年余了，我最不能忘记的是他的背影。
                </motion.p>
            </section>

            <Divider />

            {/* 第一部分：祸不单行 */}
            <section className="max-w-3xl mx-auto px-6 py-12">
                <Paragraph text="那年冬天，祖母死了，父亲的差使也交卸了，正是祸不单行的日子。我从北京到徐州，打算跟着父亲奔丧回家。到徐州见着父亲，看见满院狼藉的东西，又想起祖母，不禁簌簌地流下眼泪。父亲说：『事已如此，不必难过，好在天无绝人之路！』" />
                <Paragraph text="回家变卖典质，父亲还了亏空；又借钱办了丧事。这些日子，家中光景很是惨澹，一半为了丧事，一半为了父亲赋闲。丧事完毕，父亲要到南京谋事，我也要回北京念书，我们便同行。" />
            </section>

            {/* 第二部分：决定送行 */}
            <section className="max-w-3xl mx-auto px-6 py-12">
                <Paragraph text="到南京时，有朋友约去游逛，勾留了一日；第二日上午便须渡江到浦口，下午上车北去。父亲因为事忙，本已说定不送我，叫旅馆里一个熟识的茶房陪我同去。他再三嘱咐茶房，甚是仔细。但他终于不放心，怕茶房不妥帖；颇踌躇了一会。其实我那年已二十岁，北京已来往过两三次，是没有什么要紧的了。他踌躇了一会，终于决定还是自己送我去。我再三劝他不必去；他只说：『不要紧，他们去不好！』" />
            </section>

            {/* 第三部分：车站送别 */}
            <section className="max-w-3xl mx-auto px-6 py-12">
                <Paragraph text="我们过了江，进了车站。我买票，他忙着照看行李。行李太多了，得向脚夫行些小费才可过去。他便又忙着和他们讲价钱。我那时真是聪明过分，总觉他说话不大漂亮，非自己插嘴不可，但他终于讲定了价钱；就送我上车。他给我拣定了靠车门的一张椅子；我将他给我做的紫毛大衣铺好座位。他嘱我路上小心，夜里要警醒些，不要受凉。又嘱托茶房好好照应我。我心里暗笑他的迂；他们只认得钱，托他们只是白托！而且我这样大年纪的人，难道还不能料理自己么？我现在想想，我那时真是太聪明了。" />
            </section>

            <Divider />

            {/* 核心场景：买橘子 */}
            <section className="max-w-3xl mx-auto px-6 py-16">
                <Paragraph text="我说道：『爸爸，你走吧。』他往车外看了看，说：『我买几个橘子去。你就在此地，不要走动。』我看那边月台的栅栏外有几个卖东西的等着顾客。走到那边月台，须穿过铁道，须跳下去又爬上去。父亲是一个胖子，走过去自然要费事些。我本来要去的，他不肯，只好让他去。我看见他戴着黑布小帽，穿着黑布大马褂，深青布棉袍，蹒跚地走到铁道边，慢慢探身下去，尚不大难。可是他穿过铁道，要爬上那边月台，就不容易了。他用两手攀着上面，两脚再向上缩；他肥胖的身子向左微倾，显出努力的样子。" highlight />
            </section>

            {/* 泪水涌出 - 特殊强调 */}
            <section className="max-w-3xl mx-auto px-6 py-8">
                <motion.p
                    className="text-xl md:text-2xl text-[#2C3E50] text-center italic leading-relaxed"
                    style={{ fontFamily: 'serif' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    这时我看见他的背影，我的泪很快地流下来了。
                </motion.p>
            </section>

            <Divider />

            {/* 第四部分：离别 */}
            <section className="max-w-3xl mx-auto px-6 py-12">
                <Paragraph text="我赶紧拭干了泪。怕他看见，也怕别人看见。我再向外看时，他已抱了朱红的橘子往回走了。过铁道时，他先将橘子散放在地上，自己慢慢爬下，再抱起橘子走。到这边时，我赶紧去搀他。他和我走到车上，将橘子一股脑儿放在我的皮大衣上。于是扑扑衣上的泥土，心里很轻松似的。过一会儿说：『我走了，到那边来信！』我望着他走出去。他走了几步，回过头看见我，说：『进去吧，里边没人。』等他的背影混入来来往往的人里，再找不着了，我便进来坐下，我的眼泪又来了。" />
            </section>

            {/* 第五部分：近况 */}
            <section className="max-w-3xl mx-auto px-6 py-12">
                <Paragraph text="近几年来，父亲和我都是东奔西走，家中光景是一日不如一日。他少年出外谋生，独力支持，做了许多大事。哪知老境却如此颓唐！他触目伤怀，自然情不能自已。情郁于中，自然要发之于外；家庭琐屑便往往触他之怒。他待我渐渐不同往日。但最近两年不见，他终于忘却我的不好，只是惦记着我，惦记着我的儿子。" />
            </section>

            {/* 父亲来信 - 信纸样式 */}
            <section className="max-w-2xl mx-auto px-6 py-16">
                <motion.div
                    className="bg-white/80 rounded-lg p-8 md:p-12 shadow-lg border border-[#2C3E50]/10"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5e5e5 31px, #e5e5e5 32px)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p
                        className="text-lg text-[#3D2C1E] leading-loose"
                        style={{ fontFamily: 'serif' }}
                    >
                        我北来后，他写了一信给我，信中说道：『我身体平安，惟膀子疼痛厉害，举箸提笔，诸多不便，大约大去之期不远矣。』
                    </p>
                </motion.div>
            </section>

            {/* 结尾 */}
            <section className="max-w-3xl mx-auto px-6 py-16 relative z-10">
                <motion.p
                    className="text-2xl md:text-3xl text-[#2C3E50] font-medium mb-8"
                    style={{ fontFamily: 'serif' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    我读到此处，在晶莹的泪光中，又看见那肥胖的、青布棉袍黑布马褂的背影。唉！我不知何时再能与他相见！
                </motion.p>

                {/* 落款 */}
                <motion.p
                    className="mt-12 text-[#7F8C8D] text-lg italic"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    朱自清
                </motion.p>
            </section>
        </div>
    )
}

// 段落组件
function Paragraph({ text, highlight = false }) {
    return (
        <motion.p
            className={`text-lg ${highlight ? 'text-[#2C3E50]' : 'text-[#3D2C1E]'} leading-loose mb-6`}
            style={{ fontFamily: 'serif', textIndent: '2em' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
        >
            {text}
        </motion.p>
    )
}

// 分隔线
function Divider() {
    return (
        <div className="max-w-xs mx-auto py-8">
            <div className="flex items-center justify-center gap-4">
                <motion.div
                    className="h-px w-16 bg-gradient-to-r from-transparent to-[#2C3E50]/30"
                    initial={{ scaleX: 0, originX: 1 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                />
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        delay: 0.1
                    }}
                >
                    <OrangeIcon />
                </motion.div>
                <motion.div
                    className="h-px w-16 bg-gradient-to-l from-transparent to-[#2C3E50]/30"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                />
            </div>
        </div>
    )
}

// 橘子图标
function OrangeIcon() {
    return (
        <img src={orangeImg} alt="orange" width={64} height={64} />
    )
}
