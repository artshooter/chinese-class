import fishManSeeImg from './fish-man-see.webp'
import fishManTalkImg from './fish-man-talk.webp'

export default function Content({ onBack }) {
    return (
        <>
            <style>{`
                .peach-content::-webkit-scrollbar {
                    display: none;
                }
                .peach-content {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
            `}</style>
            <div className="peach-content min-h-screen bg-transparent text-[#2F4F4F] font-serif overflow-x-hidden">
                {/* 返回按钮 */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="fixed top-8 left-8 z-50 flex flex-col items-center gap-1 text-[#6B7280] hover:text-[#374151] transition-colors cursor-pointer"
                    >
                        <span className="text-lg mb-1">←</span>
                        <span className="text-sm tracking-[0.3em] font-light" style={{ writingMode: 'vertical-rl' }}>返回</span>
                    </button>
                )}

                {/* 第一段：缘溪行至洞口 */}
                <section className="py-20 md:py-32 px-8 max-w-4xl mx-auto">
                    <div className="space-y-20 text-center leading-[2] tracking-wide">
                        <p className="text-lg">
                            晋太元中，武陵人捕鱼为业。<br />
                            缘溪行，忘路之远近。
                        </p>
                        <p className="text-lg">
                            忽逢桃花林，夹岸数百步，中无杂树，<br />
                            <span className="text-[#92400E]">芳草鲜美，落英缤纷。</span>
                        </p>
                        <p className="text-lg">
                            渔人甚异之，复前行，欲穷其林。
                        </p>
                        <p className="text-lg">
                            林尽水源，便得一山，山有小口，仿佛若有光。<br />
                            <span className="text-[#C0C0C0]">便舍船，从口入。</span>
                        </p>
                        <p className="text-lg text-[#C0C0C0]">
                            初极狭，才通人。
                        </p>
                        <p className="text-lg">
                            复行数十步，<span className="text-3xl font-light">豁然开朗。</span>
                        </p>
                    </div>
                    <div className="flex justify-center mt-20 mb-20">
                        <div className="relative max-w-[90vw] w-full">
                            <img
                                src={fishManSeeImg}
                                alt="渔人见景"
                                className="w-full h-auto"
                                style={{
                                    maskImage: 'radial-gradient(ellipse at center, black 85%, transparent 100%)',
                                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 85%, transparent 100%)'
                                }}
                            />
                        </div>
                    </div>
                </section>



                {/* 第二段：桃源世界 */}
                <section className="pt-2 pb-20 md:pt-4 md:pb-32 px-8 max-w-4xl mx-auto">
                    <div className="space-y-20 text-center leading-[2] tracking-wide">
                        <p className="text-lg">
                            土地平旷，屋舍俨然，有良田、美池、桑竹之属。<br />
                            阡陌交通，鸡犬相闻。
                        </p>
                        <p className="text-lg">
                            其中往来种作，男女衣着，悉如外人。<br />
                            <span className="text-[#6B7280]">黄发垂髫，并怡然自乐。</span>
                        </p>
                        <p className="text-lg">
                            见渔人，乃大惊，问所从来。<br />
                            具答之。
                        </p>
                        <p className="text-lg">
                            便要还家，设酒杀鸡作食。
                        </p>
                        <p className="text-lg">
                            村中闻有此人，咸来问讯。
                        </p>
                        <p className="text-lg italic">
                            "自云先世避秦时乱，率妻子邑人来此绝境，<br />
                            不复出焉，遂与外人间隔。"
                        </p>
                        <p className="text-lg">
                            问今是何世，乃不知有汉，无论魏晋。<br />
                            <span className="text-[#9CA3AF]">此人一一为具言所闻，皆叹惋。</span>
                        </p>
                        <p className="text-lg text-[#9CA3AF]">
                            余人各复延至其家，皆出酒食。<br />
                            停数日，辞去。
                        </p>
                        <p className="text-2xl font-light text-[#92400E]">
                            "不足为外人道也。"
                        </p>
                    </div>
                    <div className="flex justify-center mt-20">
                        <div className="relative max-w-[90vw] w-full">
                            <img
                                src={fishManTalkImg}
                                alt="渔人对话"
                                className="w-full h-auto"
                                style={{
                                    maskImage: 'radial-gradient(ellipse at center, black 85%, transparent 100%)',
                                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 85%, transparent 100%)'
                                }}
                            />
                        </div>
                    </div>
                </section>



                {/* 第三段：遗失与消亡 */}
                <section className="py-20 md:py-32 px-8 max-w-4xl mx-auto">
                    <div className="space-y-20 text-center leading-[2] tracking-wide">
                        <p className="text-lg">
                            既出，得其船，便扶向路，处处志之。<br />
                            及郡下，诣太守，说如此。
                        </p>
                        <p className="text-lg">
                            太守即遣人随其往，寻向所志，遂迷。<br />
                            不复得路。
                        </p>
                        <p className="text-4xl font-light text-[#C0C0C0] italic">
                            遂迷
                        </p>
                        <p className="text-lg text-[#9CA3AF]">
                            南阳刘子骥，高尚士也，闻之，欣然规往。<br />
                            未果，寻病终。
                        </p>
                        <div className="w-px h-12 bg-gradient-to-b from-[#D1D5DB] to-transparent mx-auto" />
                        <p className="text-base text-[#D1D5DB] tracking-[0.3em]">
                            后遂无问津者
                        </p>
                    </div>
                </section>

                {/* 作者信息 */}
                <footer className="py-24 text-center text-[#D1D5DB]">
                    <p className="text-xs tracking-[0.5em]">陶渊明 · 桃花源记</p>
                </footer>
            </div>
        </>
    )
}
