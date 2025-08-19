import { Skeleton, Image } from "@mantine/core"
import { useEffect, useRef, useState } from "react"

interface LazyImageProps {
  src: string;
  alt?: string;
  className?: string;
  radius?: string;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

const LazyImage: React.FC<LazyImageProps> = (props) => {
  const imgRef = useRef<HTMLImageElement>(null)

  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    if (imgRef.current)
      observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef}>
      <Skeleton visible={!isLoaded} radius={props.radius}>
        {isInView && (
          <Image
            src={props.src}
            alt={props.alt}
            radius={props.radius}
            fit={props.fit}
            className={`
              w-full h-full object-cover transition-opacity duration-300 ease-in-out
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            onLoad={() => setIsLoaded(true)}
          />
        )}
      </Skeleton>
    </div>
  )
}

export default LazyImage