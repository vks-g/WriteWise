'use client'

import { useRef } from 'react'
import Image from 'next/image'
import ScrollReveal from '@/components/animated/ScrollReveal'
import GradientText from '@/components/animated/GradientText'
import ElectricBorder from '@/components/animated/ElectricBorder'

const AiShowcase = () => {
  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-32 bg-transparent overflow-hidden">
      {/* Background gradient accents
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-40 dark:opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-40 dark:opacity-20 pointer-events-none" /> */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid layout: responsive stack on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column: Text with ScrollReveal */}
          <div className="flex flex-col justify-center space-y-6 sm:space-y-8">
            {/* Small badge */}
            <div className="w-fit">
              <div className="inline-block px-4 py-2 rounded-full backdrop-blur-md bg-white/5 dark:bg-black/30 text-xs sm:text-sm font-semibold text-primary">
                AI-Powered Writing
              </div>
            </div>

            {/* Main heading with GradientText */}
              <ScrollReveal
                scrollContainerRef={null}
                enableBlur={true}
                baseOpacity={0.6}
                blurStrength={3}
                textClassName="text-4xl sm:text-5xl lg:text-6xl"
              >
                Your AI Writing Assistant
              </ScrollReveal>

              {/* Subheading with gradient */}


            {/* Body text with ScrollReveal */}
            <ScrollReveal
              scrollContainerRef={null}
              enableBlur={true}
              baseOpacity={0.5}
              blurStrength={2}
              textClassName="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed"
            >
              WriteWise harnesses the power of artificial intelligence to transform your creative process. Generate compelling ideas, refine your prose, and overcome writer's block with intelligent suggestions tailored to your unique voice. From brainstorming to polishing, our AI co-author works alongside you every step of the way.
            </ScrollReveal>

            {/* Feature list */}
            {/* <div className="space-y-3 pt-4"> */}
              {/* <ScrollReveal
                scrollContainerRef={null}
                enableBlur={true}
                baseOpacity={0.5}
                textClassName="flex items-start gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-foreground font-medium">AI-Powered Content Suggestions</span>
                </div>
              </ScrollReveal> */}

              {/* <ScrollReveal
                scrollContainerRef={null}
                enableBlur={true}
                baseOpacity={0.5}
                textClassName="flex items-start gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-foreground font-medium">Real-Time Writing Assistance</span>
                </div>
              </ScrollReveal>

              <ScrollReveal
                scrollContainerRef={null}
                enableBlur={true}
                baseOpacity={0.5}
                textClassName="flex items-start gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-foreground font-medium">Tone & Style Customization</span>
                </div>
              </ScrollReveal> */}
            {/* </div> */}
          </div>

          {/* Right Column: Video Preview with ElectricBorder */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full" style={{ maxWidth: '100%' }}>
              <ElectricBorder
                color="#fffcfe"
                speed={0.5}
                chaos={0.4}
                thickness={1.5}
                className="w-full"
                style={{
                  borderRadius: '1.5rem',
                  maxWidth: '100%',
                  aspectRatio: '16/9'
                }}
              >
                {/* AI Image container */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/0 dark:from-black/30 dark:to-black/10 backdrop-blur-md">
                  <Image
                    src="/aiImage.png"
                    alt="AI Writing Assistant"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </ElectricBorder>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AiShowcase
