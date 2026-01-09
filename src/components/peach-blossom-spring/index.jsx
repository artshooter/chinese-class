import Hero from './Hero'
import Content from './Content'

export default function PeachBlossomSpring({ onBack }) {
    return (
        <div className="w-full bg-[#EDE8DC]">
            <Hero />
            <Content onBack={onBack} />
        </div>
    )
}
