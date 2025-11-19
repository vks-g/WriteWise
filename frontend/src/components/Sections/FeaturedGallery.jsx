'use client'

import Link from 'next/link'
import BlurText from '@/components/animated/BlurText'
import CircularGallery from '@/components/animated/CircularGallery'

const FeaturedGallery = () => {
  // Sample blog gallery items with placeholder images
  const galleryItems = [
    {
      id: 1,
      image: 'https://picsum.photos/seed/blog-1/800/600?random',
      text: 'AI Writing',
      slug: 'ai-writing-tips'
    },
    {
      id: 2,
      image: 'https://picsum.photos/seed/blog-2/800/600?random',
      text: 'Storytelling',
      slug: 'modern-storytelling'
    },
    {
      id: 3,
      image: 'https://picsum.photos/seed/blog-3/800/600?random',
      text: 'Creativity',
      slug: 'unlocking-creativity'
    },
    {
      id: 4,
      image: 'https://picsum.photos/seed/blog-4/800/600?random',
      text: 'Editing',
      slug: 'editing-techniques'
    },
    {
      id: 5,
      image: 'https://picsum.photos/seed/blog-5/800/600?random',
      text: 'Publishing',
      slug: 'publishing-guide'
    },
    {
      id: 6,
      image: 'https://picsum.photos/seed/blog-6/800/600?random',
      text: 'Inspiration',
      slug: 'daily-inspiration'
    }
  ]

  // Wrap items with link information
  const itemsWithLinks = galleryItems.map(item => ({
    ...item,
    href: `/blog/${item.slug}`
  }))

  return (
    <section className="relative w-full py-8 sm:py-12 lg:py-16 bg-transparent overflow-hidden">
      {/* Background gradient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-40 dark:opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-40 dark:opacity-20 pointer-events-none" />

      <div className="relative z-10">
        {/* Title Section */}
        <div className="w-full px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 lg:mb-28 text-center flex flex-col items-center justify-center">
          <BlurText
            text="Explore featured blogs curated for you"
            animateBy="words"
            direction="top"
            threshold={0.3}
            delay={100}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground whitespace-nowrap"
            easing={t => t}
          />
          <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Discover inspiring stories and insights from our community of storytellers. 
            Each blog is handpicked to spark your creativity and elevate your writing.
          </p>
        </div>

        {/* Circular Gallery */}
        <div className="w-full">
          <div className="h-96 sm:h-[450px] lg:h-[500px] relative">
            <CircularGallery
              items={itemsWithLinks}
              bend={3}
              textColor="#ffffff"
              borderRadius={0.08}
              font="bold 28px Figtree"
              scrollSpeed={0.7}
              scrollEase={0.05}
            />
          </div>
        </div>

        {/* Gallery Info */}
        <div className="mt-12 sm:mt-16 lg:mt-20 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base text-muted-foreground">
            💡 <span className="font-medium">Tip:</span> Scroll horizontally or use your mouse wheel to explore more blogs. 
            Click on any featured blog to dive deeper.
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-12 sm:mt-16 lg:mt-20 flex justify-center px-4 sm:px-6 lg:px-8">
          <Link href="/posts">
            <button className="px-8 py-3 sm:px-10 sm:py-4 rounded-full font-semibold text-white backdrop-blur-md bg-white/15 dark:bg-white/10 hover:bg-white/25 dark:hover:bg-white/15 border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-400 hover:text-cyan-300 cursor-pointer">
              Explore All Blogs
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedGallery
