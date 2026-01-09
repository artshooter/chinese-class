import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// 人物故事卡片组件（可展开）
export default function StoryCard({ character }) {
    const [expanded, setExpanded] = useState(false)

    if (!character) return null

    return (
        <motion.div
            className="
                bg-[#1e293b]/90 backdrop-blur-md 
                border border-[#475569]/60 rounded-xl 
                shadow-xl shadow-black/30 overflow-hidden
                cursor-pointer max-w-sm
            "
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={() => setExpanded(!expanded)}
        >
            {/* 人物简介（始终显示） */}
            <div className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-full bg-[#d97706]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#fbbf24] font-bold text-base">
                        {character.type || '人'}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#fbbf24] text-base">{character.name}</span>
                        <span className="text-[#94a3b8] text-sm">· {character.role}</span>
                    </div>
                    <p className="text-[#cbd5e1] text-xs mt-1">{character.desc}</p>
                </div>
                {/* 展开提示 */}
                <motion.span
                    className="text-[#d97706] text-sm flex-shrink-0"
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {expanded ? '▲' : '▼'}
                </motion.span>
            </div>

            {/* 历史小故事（点击展开） */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 border-t border-[#475569]/40">
                            <div className="flex items-center gap-2 text-[#d97706] text-xs tracking-widest my-3">
                                <span className="h-px flex-1 bg-[#d97706]/30" />
                                <span>历史小故事</span>
                                <span className="h-px flex-1 bg-[#d97706]/30" />
                            </div>
                            <p className="text-[#94a3b8] text-sm leading-relaxed whitespace-pre-line">
                                {character.story}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
