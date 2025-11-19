'use client'
import ElectricBorder from '@/components/animated/ElectricBorder'

const Hero = () => {
  return (
    <section className="relative w-full h-auto  flex items-center justify-center overflow-hidden bg-transparent pt-32 sm:pt-40 lg:pt-48 pb-11 sm:pb-12 lg:pb-16">
      {/* Hero Content */}
      <div className="relative z-20 max-w-5xl mx-0 px-0 sm:px-6 lg:px-8 text-center">
        <h1
          className="
            text-1xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-5xl
            font-black leading-tight sm:leading-tight lg:leading-tight
            text-white drop-shadow-lg
            tracking-tight
            animate-fade-in
          "
        style={{
            fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
            fontVariationSettings: '"wght" 700, "slnt" 0',
        }}

        >
          <span className="block mb-2 sm:mb-3 lg:mb-4">
            Your voice.
          </span>
          <span className="block mb-2 sm:mb-3 lg:mb-4">
        <ElectricBorder color="#a30586" thickness={5.5}  chaos={1.7} >
            Supercharged by AI.
        </ElectricBorder>
          </span>
          <span className="block">
            Built for storytellers who never Stop.
          </span>
        </h1>

      </div>


    </section>
  )
}

export default Hero
