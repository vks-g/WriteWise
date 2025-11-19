'use client'

import { useRef } from 'react'
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
                {/* Glassmorphic video container */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/0 dark:from-black/30 dark:to-black/10 backdrop-blur-md">
                  {/* Video placeholder with gradient background */}
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 via-background to-accent/20 dark:from-primary/10 dark:via-black dark:to-accent/10 flex items-center justify-center">
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/25 dark:hover:bg-white/15 border border-white/20 dark:border-white/10 transition-colors cursor-pointer">
                        <svg
                          className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>

                    {/* Placeholder text */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="text-center">
                        <p className="text-sm sm:text-base text-muted-foreground/60">
                          AI Editor Demo
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actual video element (hidden by default, ready for real video) */}
                  <video
                    className="w-full h-full object-cover hidden"
                    controls
                    poster="/images/video-poster.png"
                  >
                    <source src="/videos/ai-editor-demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
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
