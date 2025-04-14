import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// In your actual implementation, use your real imports:
import womanImg from "../assets/woman.png";
import manImg from "../assets/manImg.png";

const testimonials = [
  {
    name: "Sarah Amalija",
    company: "BuildLabs",
    title: "Founder & Creative Director, BuildLabs®",
    image: womanImg, // Replace with actual import in your code
    words: ["We", "couldn't", "imagine", "Expanding", "without", "Wholesale"],
    bgClass: "bg-gradient-to-r from-zinc-700 to-slate-400",
  },
  {
    name: "John Doe",
    company: "TechFusion",
    title: "CEO, TechFusion",
    image: manImg, // Replace with actual import in your code
    words: ["Wholesale", "made", "our", "growth", "10x", "faster"],
    bgClass: "bg-gradient-to-r from-sky-800 to-cyan-600",
  },
];

const variants = {
  enter: (direction) => ({
    x: direction === "right" ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction === "right" ? -300 : 300,
    opacity: 0,
  }),
};

const TestimonialSlider = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("right");

  const nextSlide = () => {
    setDirection("right");
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[current];

  return (
    <div className="w-full h-96 md:h-screen relative">
      <div className="w-full h-full overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            className={`w-full h-full relative ${testimonial.bgClass}`}
          >
            {/* Background Image with overlay */}
            <div className="absolute inset-0 z-0">
              {/* In your actual code, use the real image import */}
              <img
                src={testimonial.image}
                alt=""
                className="w-full h-full object-cover object-center"
              />
              {/* Semi-transparent overlay to ensure text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
              <div className="flex flex-wrap gap-2 w-2/3 sm:w-1/2">
                {testimonial.words.map((word, i) => (
                  <div
                    key={i}
                    className="bg-white text-sm md:text-base text-gray-700 px-2 md:px-4 py-2 rounded-full"
                  >
                    {word}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-bold text-white">{testimonial.name}</h3>
                <p className="text-white text-sm md:text-base mb-2">{testimonial.title}</p>

                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 
                          18.18 21.02 12 17.77 5.82 21.02 
                          7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Company label */}
              <div className="absolute bottom-8 right-8">
                <div className="bg-white px-3 py-1 rounded-md">
                  <span className="font-bold">{testimonial.company}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TestimonialSlider;