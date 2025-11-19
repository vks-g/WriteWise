'use client'

import SpotlightCard from '@/components/animated/SpotlightCard'

const USPSection = () => {
  const uspPoints = [
    {
      id: 1,
      title: 'AI with Your Style',
      description: 'Get intelligent writing assistance that adapts to your unique voice and tone, never replacing your creativity—only enhancing it.'
    },
    {
      id: 2,
      title: 'Drafts & Versioning',
      description: 'Save multiple versions of your work, experiment freely, and return to previous drafts whenever inspiration strikes in a new direction.'
    },
    {
      id: 3,
      title: 'Distraction-Free Editor',
      description: 'Write in a clean, minimal environment designed for focus. Eliminate distractions and immerse yourself in your storytelling.'
    },
    {
      id: 4,
      title: 'Fast Publishing',
      description: 'From draft to live with just one click. Publish instantly and share your stories with the world without complicated workflows.'
    }
  ]

  return (
    <section className="relative w-full py-20 sm:py-28 lg:py-40 bg-transparent overflow-hidden">
      {/* Background gradient accents */}
      {/* <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-40 dark:opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-40 dark:opacity-20 pointer-events-none" /> */}

      {/* <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16 sm:mb-20 lg:mb-28 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Why Choose WriteWise?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Built for modern storytellers who value creativity, control, and simplicity. 
            Every feature is designed with you in mind.
          </p>
        </div>

        {/* USP Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6">
          {uspPoints.map(usp => (
            <div key={usp.id} className="h-full">
              <SpotlightCard
                className="
                  h-full flex flex-col justify-start
                  border-white/10 dark:border-white/5
                  bg-white/3 dark:bg-black/20
                  backdrop-blur-md
                  hover:bg-white/5 dark:hover:bg-black/30
                  hover:border-white/20 dark:hover:border-white/10
                  transition-all duration-300
                "
                spotlightColor="rgba(82, 39, 255, 0.3)"
              >
                {/* Card Content */}
                <div className="flex flex-col h-full">
                  {/* Icon placeholder */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-4 sm:mb-6">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-primary to-accent rounded-md opacity-70" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                    {usp.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-grow">
                    {usp.description}
                  </p>

                  {/* Optional: Arrow indicator */}
                  <div className="mt-6 sm:mt-8 pt-6 flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>

        {/* Optional: Bottom CTA */}
        <div className="mt-16 sm:mt-20 lg:mt-28 w-full flex justify-center px-4 sm:px-6 lg:px-8">
          <div className="px-6 sm:px-8 py-0 rounded-lg backdrop-blur-md bg-white/5 dark:bg-black/30">
            <p className="text-sm sm:text-base text-muted-foreground text-center">
              ✨ Ready to revolutionize your writing? <span className="text-primary font-semibold">Start free today</span>
            </p>
          </div>
        </div>
    </section>
  )
}

export default USPSection
