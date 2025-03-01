// src/app/page.jsx
import Carousel from '@/components/Carousel'; // Import the Carousel component
import Socials from '@/components/Socials';

export default function Home() {
  return (
    <div>
      <Carousel /> 
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Textbook Exchange</h2>
        <p className="text-gray-600">
          Connect with others to share educational materials and make learning accessible for everyone.
        </p>
      </div>
    </div>
  );
}