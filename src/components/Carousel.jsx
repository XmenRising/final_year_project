// src/components/Carousel.jsx
'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Carousel() {
  const slides = [
    // ... your slide data remains the same ...
    {
      id: 1,
      title: 'Share Your Unused Textbooks',
      description: 'Help others by sharing your educational materials.',
      image: '/images/slide1.jpg', // Replace with your image path
    },
    {
      id: 2,
      title: 'Find the Materials You Need',
      description: 'Get the textbooks and resources you need for free.',
      image: '/images/slide2.jpg', // Replace with your image path
    },
    {
      id: 3,
      title: 'Join Our Community',
      description: 'Be part of a community that values education and sharing.',
      image: '/images/slide3.jpg', // Replace with your image path
    },
  ];

  return (
    <div className="relative w-full" style={{ paddingTop: '64px' }}>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="h-[300px] md:h-[500px] w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="h-full w-full bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="text-center bg-black bg-opacity-50 p-6 rounded-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{slide.title}</h2>
                <p className="text-lg md:text-xl text-white">{slide.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
