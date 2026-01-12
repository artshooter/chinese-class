import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Hero from './Hero.jsx'
import chaImg from './cha.webp'

export default function Content({ onBack }) {
    return (
        <div className="min-h-screen bg-[#f0f0f4] text-[#2d3336] font-serif relative transition-colors duration-1000">

            {/* 返回按钮 */}
            {onBack && (
                <motion.button
                    onClick={onBack}
                    className="fixed top-6 left-6 z-50 px-4 py-2 
                        bg-white/80 backdrop-blur-sm
                        border border-[#2d3336]/10
                        rounded-full shadow-sm
                        text-[#2d3336]/80 hover:text-[#2d3336] hover:bg-white
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

            {/* Hero: The Dream */}
            <Hero />

            {/* Main Content Area */}
            <div className="max-w-3xl mx-auto px-6 py-12 md:py-24 space-y-12">

                {/* Intro */}
                <section className="space-y-8 relative">
                    <WindEffect />
                    <Paragraph text="我冒了严寒，回到相隔二千余里，别了二十余年的故乡去。" />
                    <Paragraph text="时候既然是深冬；渐近故乡时，天气又阴晦了，冷风吹进船舱中，呜呜的响，从篷隙向外一望，苍黄的天底下，远近横着几个萧索的荒村，没有一些活气。我的心禁不住悲凉起来了。" className="text-[#6e757c]" />
                    <Paragraph text="阿！这不是我二十年来时时记得的故乡？" />
                    <Paragraph text="我所记得的故乡全不如此。我的故乡好得多了。但要我记起他的美丽，说出他的佳处来，却又没有影像，没有言辞了。仿佛也就如此。于是我自己解释说：故乡本也如此，——虽然没有进步，也未必有如我所感的悲凉，这只是我自己心情的改变罢了，因为我这次回乡，本没有什么好心绪。" />
                    <Paragraph text="我这次是专为了别他而来的。我们多年聚族而居的老屋，已经公同卖给别姓了，交屋的期限，只在本年，所以必须赶在正月初一以前，永别了熟识的老屋，而且远离了熟识的故乡，搬家到我在谋食的异地去。" />
                </section>

                <section className="space-y-8 bg-[#e8e8e6] p-8 rounded-lg shadow-inner">
                    <Paragraph text="第二日清早晨我到了我家的门口了。瓦楞上许多枯草的断茎当风抖着，正在说明这老屋难免易主的原因。几房的本家大约已经搬走了，所以很寂静。我到了自家的房外，我的母亲早已迎着出来了，接着便飞出了八岁的侄儿宏儿。" />
                    <Paragraph text="我的母亲很高兴，但也藏着许多凄凉的神情，教我坐下，歇息，喝茶，且不谈搬家的事。宏儿没有见过我，远远的对面站着只是看。" />
                    <Paragraph text="但我们终于谈到搬家的事。我说外间的寓所已经租定了，又买了几件家具，此外须将家里所有的木器卖去，再去增添。母亲也说好，而且行李也略已齐集，木器不便搬运的，也小半卖去了，只是收不起钱来。" />
                </section>

                {/* Dialogue Section 1 */}
                <section className="pl-6 border-l-2 border-[#d1d5db] space-y-4">
                    <Dialogue text="你休息一两天，去拜望亲戚本家一回，我们便可以走了。" speaker="母亲" />
                    <Dialogue text="是的。" speaker="我" />
                    <Dialogue text="还有闰土，他每到我家来时，总问起你，很想见你一回面。我已经将你到家的大约日期通知他，他也许就要来了。" speaker="母亲" />
                </section>

                {/* The Memory Flashback - Highlighted */}
                <section className="relative my-24 p-8 md:p-12 rounded-lg bg-gradient-to-br from-[#1b3a57] to-[#162e45] text-white shadow-2xl overflow-hidden group">
                    {/* Decorative Moon */}
                    <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#f2c04d] rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity" />

                    <div className="relative z-10 space-y-6">
                        <h2 className="text-[#f2c04d] text-xl mb-6 flex items-center gap-4">
                            <span className="h-px flex-1 bg-[#f2c04d]/30"></span>
                            神异的图画
                            <span className="h-px flex-1 bg-[#f2c04d]/30"></span>
                        </h2>
                        <Paragraph text="这时候，我的脑里忽然闪出一幅神异的图画来：深蓝的天空中挂着一轮金黄的圆月，下面是海边的沙地，都种着一望无际的碧绿的西瓜，其间有一个十一二岁的少年，项带银圈，手捏一柄钢叉，向一匹猹尽力的刺去，那猹却将身一扭，反从他的胯下逃走了。" className="text-white/90 !text-lg !leading-loose" disableHighlight={true} />
                        <Paragraph text="这少年便是闰土。我认识他时，也不过十多岁，离现在将有三十年了；那时我的父亲还在世，家景也好，我正是一个少爷。那一年，我家是一件大祭祀的值年。这祭祀，说是三十多年才能轮到一回，所以很郑重；正月里供祖像，供品很多，祭器很讲究，拜的人也很多，祭器也很要防偷去。我家只有一个忙月（我们这里给人做工的分三种：整年给一定人家做工的叫长年；按日给人做工的叫短工；自己也种地，只在过年过节以及收租时候来给一定的人家做工的称忙月），忙不过来，他便对父亲说，可以叫他的儿子闰土来管祭器的。" className="text-white/80" />
                        <Paragraph text="我的父亲允许了；我也很高兴，因为我早听到闰土这名字，而且知道他和我仿佛年纪，闰月生的，五行缺土，所以他的父亲叫他闰土。他是能装弶捉小鸟雀的。" className="text-white/80" />
                        <Paragraph text="我于是日日盼望新年，新年到，闰土也就到了。好容易到了年末，有一日，母亲告诉我，闰土来了，我便飞跑的去看。他正在厨房里，紫色的圆脸，头戴一顶小毡帽，颈上套一个明晃晃的银项圈，这可见他的父亲十分爱他，怕他死去，所以在神佛面前许下愿心，用圈子将他套住了。他见人很怕羞，只是不怕我，没有旁人的时候，便和我说话，于是不到半日，我们便熟识了。" className="text-white/80" />
                    </div>
                </section>

                {/* Memory Dialogues */}
                <section className="space-y-8">
                    <Paragraph text="我们那时候不知道谈些什么，只记得闰土很高兴，说是上城之后，见了许多没有见过的东西。" />
                    <Paragraph text="第二日，我便要他捕鸟。他说：" />
                    <div className="pl-6 border-l-2 border-[#f2c04d] space-y-4">
                        <Dialogue text="这不能。须大雪下了才好。我们沙地上，下了雪，我扫出一块空地来，用短棒支起一个大竹匾，撒下秕谷，看鸟雀来吃时，我远远地将缚在棒上的绳子只一拉，那鸟雀就罩在竹匾下了。什么都有：稻鸡，角鸡，鹁鸪，蓝背……" speaker="闰土" />
                    </div>
                    <Paragraph text="我于是又很盼望下雪。闰土又对我说：" />
                    <div className="pl-6 border-l-2 border-[#f2c04d] space-y-4">
                        <Dialogue text="现在太冷，你夏天到我们这里来。我们日里到海边捡贝壳去，红的绿的都有，鬼见怕也有，观音手也有。晚上我和爹管西瓜去，你也去。" speaker="闰土" />
                        <Dialogue text="管贼么？" speaker="我" />
                        <Dialogue text="不是。走路的人口渴了摘一个瓜吃，我们这里是不算偷的。要管的是獾猪，刺猬，猹。月亮地下，你听，啦啦的响了，猹在咬瓜了。你便捏了胡叉，轻轻地走去……" speaker="闰土" />
                    </div>
                    <Paragraph text="我那时并不知道这所谓猹的是怎么一件东西——便是现在也没有知道——只是无端的觉得状如小狗而很凶猛。" />

                    {/* Cha image with caption */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        className="my-8 flex flex-col items-center gap-1"
                    >
                        <div className="relative w-full max-w-md h-64 md:h-80">
                            <img
                                src={chaImg}
                                alt="吃西瓜的猹"
                                className="object-contain w-full h-full"
                            />
                        </div>
                        <p className="text-center text-sm md:text-base text-[#6e757c] italic">吃西瓜的猹</p>
                    </motion.div>

                    <div className="pl-6 border-l-2 border-[#f2c04d] space-y-4">
                        <Dialogue text="他不咬人么？" speaker="我" />
                        <Dialogue text="有胡叉呢。走到了，看见猹了，你便刺。这畜生很伶俐，倒向你奔来，反从胯下窜了。他的皮毛是油一般的滑……" speaker="闰土" />
                    </div>
                    <Paragraph text="我素不知道天下有这许多新鲜事：海边有如许五色的贝壳；西瓜有这样危险的经历，我先前单知道他在水果店里出卖罢了。" />
                    <div className="pl-6 border-l-2 border-[#f2c04d] space-y-4">
                        <Dialogue text="我们沙地里，潮汛要来的时候，就有许多跳鱼儿只是跳，都有青蛙似的两个脚……" speaker="闰土" />
                    </div>
                    <Paragraph text="阿！闰土的心里有无穷无尽的稀奇的事，都是我往常的朋友所不知道的。他们不知道一些事，闰土在海边时，他们都和我一样只看见院子里高墙上的四角的天空。" className="text-[#1b3a57] font-medium" />
                    <Paragraph text="可惜正月过去了，闰土须回家里去，我急得大哭，他也躲到厨房里，哭着不肯出门，但终于被他父亲带走了。他后来还托他的父亲带给我一包贝壳和几支很好看的鸟毛，我也曾送他一两次东西，但从此没有再见面。" />
                </section>

                {/* Awakening to Reality */}
                <section className="space-y-8">
                    <Paragraph text="现在我的母亲提起了他，我这儿时的记忆，忽而全都闪电似的苏生过来，似乎看到了我的美丽的故乡了。我应声说：" />
                    <Dialogue text="这好极！他，——怎样？……" speaker="我" />
                    <Dialogue text="他？……他景况也很不如意……" speaker="母亲" />
                    <div className="h-px w-24 bg-[#d1d5db] mx-auto my-12" />
                    <Paragraph text="此后又有近处的本家和亲戚来访问我。我一面应酬，偷空便收拾些行李，这样的过了三四天。一日是天气很冷的午后，我吃过午饭，坐着喝茶，觉得外面有人进来了，便回头去看。我看时，不由的非常出惊，慌忙站起身，迎着走去。" />
                    <Paragraph text="这来的便是闰土。虽然我一见便知道是闰土，但又不是我这记忆上的闰土了。" />
                    <Paragraph text="他身材增加了一倍；先前的紫色的圆脸，已经变作灰黄，而且加上了很深的皱纹；眼睛也像他父亲一样，周围都肿得通红，这我知道，在海边种地的人，终日吹着海风，大抵是这样的。他头上是一顶破毡帽，身上只一件极薄的棉衣，浑身瑟索着；手里提着一个纸包和一支长烟管，那手也不是我所记得的红活圆实的手，却又粗又笨而且开裂，像是松树皮了。" className="text-[#6e757c] italic" />
                    <Paragraph text="我这时很兴奋，但不知道怎么说才好，只是说：" />
                    <Dialogue text="阿！闰土哥，——你来了？……" speaker="我" />
                    <Paragraph text="我接着便有许多话，想要连珠一般涌出：角鸡，跳鱼儿，贝壳，猹，……但又总觉得被什么挡着似的，单在脑里面回旋，吐不出口外去。" />
                    <Paragraph text="他站住了，脸上现出欢喜和凄凉的神情；动着嘴唇，却没有作声。他的态度终于恭敬起来了，分明的叫道：" />
                    <Dialogue text="「老爷！……」" speaker="闰土" />
                    <Paragraph text="我似乎打了一个寒噤；我就知道，我们之间已经隔了一层可悲的厚障壁了。我也说不出话。" className="text-center text-xl text-[#8c3f3f]" />
                </section>
            </div>

            <div className="max-w-3xl mx-auto px-6 pb-24 space-y-12">

                <section className="space-y-4">
                    <Paragraph text="他回过头去说，「水生，给老爷磕头。」便拖出躲在背后的孩子来，这正是一个廿年前的闰土，只是黄瘦些，颈子上没有银圈罢了。「这是第五个孩子，没有见过世面，躲躲闪闪……」" />
                    <Paragraph text="母亲和宏儿下楼来了，他们大约也听到了声音。" />
                    <div className="pl-6 border-l-2 border-[#d1d5db] space-y-4 text-sm md:text-base">
                        <Dialogue text="老太太。信是早收到了。我实在喜欢的不得了，知道老爷回来……" speaker="闰土" />
                        <Dialogue text="阿，你怎的这样客气起来。你们先前不是哥弟称呼么？还是照旧：迅哥儿。" speaker="母亲" />
                        <Dialogue text="阿呀，老太太真是……这成什么规矩。那时是孩子，不懂事……" speaker="闰土" />
                        <Dialogue text="他就是水生？第五个？都是生人，怕生也难怪的；还是宏儿和他去走走。" speaker="母亲" />
                    </div>
                </section>

                <section className="space-y-8">
                    <Paragraph text="宏儿听得这话，便来招水生，水生却松松爽爽同他一路出去了。母亲叫闰土坐，他迟疑了一回，终于就了坐，将长烟管靠在桌旁，递过纸包来，说：" />
                    <Dialogue text="冬天没有什么东西了。这一点干青豆倒是自家晒在那里的，请老爷……" speaker="闰土" />
                    <Paragraph text="我问问他的景况。他只是摇头。" />
                    <Dialogue text="非常难。第六个孩子也会帮忙了，却总是吃不够……又不太平……什么地方都要钱，没有规定……收成又坏。种出东西来，挑去卖，总要捐几回钱，折了本；不去卖，又只能烂掉……" speaker="闰土" />
                    <Paragraph text="他只是摇头；脸上虽然刻着许多皱纹，却全然不动，仿佛石像一般。他大约只是觉得苦，却又形容不出，沉默了片时，便拿起烟管来默默的吸烟了。" />
                    <Paragraph text="母亲问他，知道他的家里事务忙，明天便得回去；又没有吃过午饭，便叫他自己到厨下炒饭吃去。" />
                    <Paragraph text="他出去了；母亲和我都叹息他的景况：多子，饥荒，苛税，兵，匪，官，绅，都苦得他像一个木偶人了。母亲对我说，凡是不必搬走的东西，尽可以送他，可以听他自己去拣择。" />
                    <Paragraph text="下午，他拣好了几件东西：两条长桌，四个椅子，一副香炉和烛台，一杆抬秤。他又要所有的草灰（我们这里煮饭是烧稻草的，那灰，可以做沙地的肥料），待我们启程的时候，他用船来载去。" />
                    <Paragraph text="夜间，我们又谈些闲天，都是无关紧要的话；第二天早晨，他就领了水生回去了。" />
                </section>

                <section className="space-y-8">
                    <Paragraph text="又过了九日，是我们启程的日期。闰土早晨便到了，水生没有同来，却只带着一个五岁的女儿管船只。我们终日很忙碌，再没有谈天的工夫。来客也不少，有送行的，有拿东西的，有送行兼拿东西的。待到傍晚我们上船的时候，这老屋里的所有破旧大小粗细东西，已经一扫而空了。" />
                    <Paragraph text="我们的船向前走，两岸的青山在黄昏中，都装成了深黛颜色，连着退向船后梢去。" />
                    <Paragraph text="宏儿和我靠着船窗，同看外面模糊的风景，他忽然问道：" />
                    <div className="pl-6 border-l-2 border-[#d1d5db] space-y-4">
                        <Dialogue text="大伯！我们什么时候回来？" speaker="宏儿" />
                        <Dialogue text="回来？你怎么还没有走就想回来了。" speaker="我" />
                        <Dialogue text="可是，水生约我到他家玩去咧……" speaker="宏儿" />
                    </div>
                    <Paragraph text="老屋离我愈远了；故乡的山水也都渐渐远离了我，但我却并不感到怎样的留恋。我只觉得我四面有看不见的高墙，将我隔成孤身，使我非常气闷；那西瓜地上的银项圈的小英雄的影像，我本来十分清楚，现在却忽地模糊了，又使我非常的悲哀。" className="text-[#6e757c]" />
                    <Paragraph text="母亲和宏儿都睡着了。" />
                    <Paragraph text="我躺着，听船底潺潺的水声，知道我在走我的路。我想：我竟与闰土隔绝到这地步了，但我们的后辈还是一气，宏儿不是正在想念水生么。我希望他们不再像我，又大家隔膜起来……然而我又不愿意他们因为要一气，都如我的辛苦展转而生活，也不愿意他们都如闰土的辛苦麻木而生活，也不愿意都如别人的辛苦恣睢而生活。他们应该有新的生活，为我们所未经生活过的。" />
                    <Paragraph text="我想到希望，忽然害怕起来了。闰土要香炉和烛台的时候，我还暗地里笑他，以为他总是崇拜偶像，什么时候都不忘却。现在我所谓希望，不也是我自己手制的偶像么？只是他的愿望切近，我的愿望茫远罢了。" />
                </section>
            </div>

            {/* The Ending - Hope */}
            <section className="min-h-[60vh] flex flex-col items-center justify-center bg-[#1b3a57] text-white p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2d5a3f]/30 to-transparent opacity-50" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="max-w-2xl text-center z-10 space-y-12"
                >
                    <Paragraph text="我在朦胧中，眼前展开一片海边碧绿的沙地来，上面深蓝的天空中挂着一轮金黄的圆月。我想：希望本是无所谓有，无所谓无的。这正如地上的路；其实地上本没有路，走的人多了，也便成了路。" className="text-white/80 !text-lg" />

                    <div className="relative inline-block mt-12 group cursor-default">
                        <p className="text-2xl md:text-4xl font-serif leading-normal tracking-wide text-[#f2c04d] opacity-90 group-hover:opacity-100 transition-opacity">
                            "其实地上本没有路，<br />走的人多了，也便成了路。"
                        </p>
                        <div className="absolute -inset-8 bg-[#f2c04d] blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 rounded-full" />
                    </div>
                </motion.div>
            </section>

        </div>
    )
}

function Paragraph({ text, className = '', disableHighlight = false }) {
    // Regex to find specific keywords to highlight
    const keywords = [
        { word: '金黄的圆月', color: '#f2c04d' },
        { word: '深蓝的天空', color: '#87ceeb' },
        { word: '碧绿的西瓜', color: '#2d5a3f' }
    ];

    let content = [text];

    if (!disableHighlight) {
        keywords.forEach(({ word, color }) => {
            const newContent = [];
            content.forEach((part) => {
                if (typeof part === 'string' && part.includes(word)) {
                    const split = part.split(word);
                    split.forEach((s, i) => {
                        newContent.push(s);
                        if (i < split.length - 1) {
                            newContent.push(
                                <span
                                    key={`${word}-${i}`}
                                    className="relative inline cursor-pointer font-bold px-1 rounded transition-colors duration-300 hover:text-white group/highlight whitespace-nowrap"
                                    style={{ color: color }}
                                >
                                    <span className="relative z-10">{word}</span>
                                    <span
                                        className="absolute inset-0 rounded opacity-0 group-hover/highlight:opacity-100 transition-opacity duration-300"
                                        style={{ backgroundColor: color }}
                                    />
                                </span>
                            );
                        }
                    });
                } else {
                    newContent.push(part);
                }
            });
            content = newContent;
        });
    }

    return (
        <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className={`text-lg leading-loose text-justify ${className}`}
            style={{ textIndent: '2em' }}
        >
            {content}
        </motion.p>
    )
}

function WindEffect() {
    const [positions, setPositions] = useState([])
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setPositions([...Array(5)].map(() => ({
            top: Math.random() * 100,
            yOffset: Math.random() * 50 - 25,
            duration: 10 + Math.random() * 10,
            delay: Math.random() * 10,
        })))
        setIsMounted(true)
    }, [])

    if (!isMounted || positions.length === 0) return null

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden h-[150vh] z-0">
            {positions.map((pos, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-[#6e757c]/10 h-px w-24 rounded-full"
                    style={{
                        top: `${pos.top}%`,
                        left: `-10%`,
                    }}
                    animate={{
                        x: ['0vw', '100vw'],
                        y: [0, pos.yOffset],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: pos.duration,
                        repeat: Infinity,
                        delay: pos.delay,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    )
}

function Dialogue({ text, speaker }) {
    return (
        <div className="flex gap-2 text-base md:text-lg">
            <span className="font-bold text-[#6e757c] shrink-0 w-16 text-right text-sm pt-1.5 opacity-70">{speaker}</span>
            <p className="flex-1 leading-relaxed text-[#2d3336]">{text}</p>
        </div>
    )
}
