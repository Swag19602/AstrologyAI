'use client';

import { useRouter } from 'next/router';
import { useState } from 'react';

const AstrologyForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        timeOfBirth: '',
        placeOfBirth: '',
    });
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const geoRes = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${formData.placeOfBirth}&key=${process.env.NEXT_PUBLIC_GEOCODE_API_KEY}`
            );
            const geoData = await geoRes.json();
            const location = geoData.results[0];

            if (!location) throw new Error('Could not find location');

            const latitude = location.geometry.lat;
            const longitude = location.geometry.lng;
            const timezone = location.annotations.timezone.name;

            const payload = {
                ...formData,
                latitude,
                longitude,
                timezone,
            };

            const res = await fetch('/api/saveKundali', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Something went wrong');

            localStorage.setItem('kundaliData', JSON.stringify(data));
            setSuccess(true);
            setTimeout(() => router.push('/chat'), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-[#3b0764] via-[#6b21a8] to-[#f97316] text-white space-y-6 border border-yellow-100/20"
        >
            <h2 className="text-4xl font-bold text-center text-yellow-300 drop-shadow-md">
                🪔 Kundali Details
            </h2>
            <p className="text-center text-lg text-orange-100">
                Fill in your birth details to receive Vedic insights into your destiny.
            </p>

            {/* Full Name */}
            <div className="space-y-1">
                <label htmlFor="name" className="text-yellow-100 font-medium">Full Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your Full Name"
                    required
                    className="w-full bg-white/10 text-yellow-100 placeholder-gray border border-yellow-300/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                />
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
                <label htmlFor="dateOfBirth" className="text-yellow-100 font-medium">Date of Birth</label>
                <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 text-black border border-yellow-300/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                />
            </div>

            {/* Time of Birth */}
            <div className="space-y-1">
                <label htmlFor="timeOfBirth" className="text-yellow-100 font-medium">Time of Birth</label>
                <input
                    type="time"
                    name="timeOfBirth"
                    id="timeOfBirth"
                    value={formData.timeOfBirth}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 text-black border border-yellow-300/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                />
            </div>

            {/* Place of Birth */}
            <div className="space-y-1">
                <label htmlFor="placeOfBirth" className="text-yellow-100 font-medium">Place of Birth</label>
                <input
                    type="text"
                    name="placeOfBirth"
                    id="placeOfBirth"
                    placeholder="City, State or Village"
                    value={formData.placeOfBirth}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 text-yellow-100 placeholder-gray border border-yellow-300/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold text-lg py-3 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-md"
                disabled={loading}
            >
                {loading ? '🧠 Calculating your Kundali...' : '🔮 Generate Kundali'}
            </button>

            {/* Feedback */}
            {success && <p className="text-green-300 text-center">✅ Kundali Saved Successfully!</p>}
            {error && <p className="text-red-300 text-center">⚠️ {error}</p>}
        </form>
    );
};

export default AstrologyForm;