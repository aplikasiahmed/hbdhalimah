import React from 'react';
import { Heart } from 'lucide-react';

interface PhotoFrameProps {
  url: string;
}

const PhotoFrame: React.FC<PhotoFrameProps> = ({ url }) => {
  return (
    <div className="relative group mx-auto w-64 h-64 md:w-80 md:h-80 animate-float z-10">
      {/* Decorative circles */}
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-300 to-pink-200 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Main Frame */}
      <div className="relative w-full h-full rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
        <img 
          src={url} 
          alt="Siti Halimah" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      
      {/* Floating Badge */}
      <div className="absolute -bottom-4 right-4 bg-white p-3 rounded-full shadow-lg text-rose-500 animate-bounce">
        <Heart fill="#e11d48" className="w-6 h-6" />
      </div>
    </div>
  );
};

export default PhotoFrame;