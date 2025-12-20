"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!slides.length) {
    return (
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px] bg-black flex items-center justify-center">
        <p className="text-zinc-600">No hero slides configured</p>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden bg-black">
      {/* Diagonal stripes background */}
      <div className="absolute inset-0 diagonal-stripes opacity-50" />

      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative">
              <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
                {/* Background image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />

                {/* Dark overlay with diagonal cut */}
                <div className="absolute inset-0 hero-overlay" />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-grid opacity-30" />

                {/* Noise texture */}
                <div className="absolute inset-0 noise-overlay" />

                {/* Accent corner elements */}
                <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-lime/30" />
                <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-lime/30" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                      {slide.subtitle && (
                        <div className="flex items-center gap-2 mb-4 animate-fade-in">
                          <Zap className="h-5 w-5 text-lime" />
                          <p className="text-lime font-bold text-sm md:text-base uppercase tracking-[0.2em]">
                            {slide.subtitle}
                          </p>
                        </div>
                      )}
                      <h1 className="font-display text-5xl md:text-6xl lg:text-8xl text-white mb-4 animate-fade-in animation-delay-100 leading-none">
                        {slide.title.split(' ').map((word, i) => (
                          <span key={i} className={i === 0 ? "text-lime" : ""}>
                            {word}{' '}
                          </span>
                        ))}
                      </h1>
                      {slide.description && (
                        <p className="text-zinc-300 text-base md:text-lg mb-8 max-w-xl animate-fade-in animation-delay-200 leading-relaxed">
                          {slide.description}
                        </p>
                      )}
                      {slide.buttonText && slide.buttonLink && (
                        <Link href={slide.buttonLink}>
                          <Button
                            size="lg"
                            className="bg-lime hover:bg-lime-500 text-black font-bold uppercase tracking-wider px-8 py-6 text-base rounded-none animate-fade-in animation-delay-300 btn-shine group"
                          >
                            {slide.buttonText}
                            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Decorative line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lime to-transparent opacity-50" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows - brutal style */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 bg-black/80 backdrop-blur-sm text-lime hover:bg-lime hover:text-black hidden md:flex rounded-none border border-zinc-800 hover:border-lime transition-all"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-7 w-7" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 bg-black/80 backdrop-blur-sm text-lime hover:bg-lime hover:text-black hidden md:flex rounded-none border border-zinc-800 hover:border-lime transition-all"
        onClick={scrollNext}
      >
        <ChevronRight className="h-7 w-7" />
      </Button>

      {/* Progress indicators - aggressive bar style */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-1 transition-all duration-300 rounded-none",
              selectedIndex === index
                ? "bg-lime w-12"
                : "bg-zinc-600 hover:bg-zinc-500 w-6"
            )}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-2 text-zinc-500 font-mono text-sm">
        <span className="text-lime font-bold text-xl">{String(selectedIndex + 1).padStart(2, '0')}</span>
        <span>/</span>
        <span>{String(slides.length).padStart(2, '0')}</span>
      </div>
    </section>
  );
}
