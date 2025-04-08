import React from 'react';
import AstrologyForm from '../components/AstrologyForm';
import Layout from '../components/Layout';
import { Sparkles } from 'lucide-react';

const Home: React.FC = () => {
    return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f9a825] via-[#ff8c00] to-[#ff4500] text-white py-10 px-4">
                <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="text-yellow-300 w-12 h-12" />
                    <h1 className="text-5xl font-extrabold tracking-wide">Astrology AI</h1>
                </div>
                <p className="text-lg mb-8 text-center max-w-2xl">
                    🌟 Enter your Kundali details below to receive personalized predictions and insights from Gemini, your Vedic astrology assistant.
                </p>
                <AstrologyForm />
            </div>
    );
};

export default Home;