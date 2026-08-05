'use client';

import { ChevronsUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="w-13 h-13 rounded-full bg-[#6d5dfc] hover:bg-[#5b4be3] text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-50 cursor-pointer"
      title="Scroll to Top"
    >
      <ChevronsUp className="w-7 h-7 stroke-[2.5]" />
    </button>
  );
}
