"use client";

import React, {useRef} from 'react';
import Autoplay from "embla-carousel-autoplay";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import Image from "next/image";
import {formatImageUrl} from "@/features/actualites/utils/image-utils";

type CarouselImageProps = {
    images: string[];
}

function CarouselImage({images}:CarouselImageProps) {
    const plugin = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )
    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full mx-auto"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {images.map((imageUrl, index) => (
                    <CarouselItem key={index} >
                        <Image
                            src={formatImageUrl(imageUrl)}
                            alt={`Image ${index + 1}`}
                            width={500}
                            height={500}
                            className="aspect-square object-cover"
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
        </Carousel>
    );
}

export default CarouselImage;