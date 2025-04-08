'use client';

import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import { Sparkles } from 'lucide-react';

const Chat = () => {
    const [messages, setMessages] = useState<any[]>([
        { from: 'bot', text: '🔮 Namaste! Ask me anything about your Kundali, future, or inner journey.' },
    ]);
    const [input, setInput] = useState('');
    const [kundaliData, setKundaliData] = useState<any>(null);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const stored = localStorage.getItem('kundaliData');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setKundaliData(parsed);
            } catch (err) {
                console.error('Invalid kundaliData in localStorage:', err);
                setKundaliData(null);
            }
        }
    }, []);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        const newMessages = [...messages, { from: 'user', text: userMessage }];
        setMessages(newMessages);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userMessage, kundaliData }),
            });

            const data = await res.json();
            const reply = data.reply || '❓ Sorry, I could not understand that.';
            setMessages([...newMessages, { from: 'bot', text: reply }]);
        } catch (err) {
            setMessages([
                ...newMessages,
                { from: 'bot', text: '⚠️ Something went wrong. Please try again later.' },
            ]);
        } finally {
            setInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#6a0dad] via-[#ffcc00] to-[#ff6347] p-6 rounded-xl shadow-2xl text-white min-h-[600px]">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="text-yellow-300" /> Vedic AstroBot
            </h2>
            <div className="h-[450px] overflow-y-auto p-4 space-y-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 shadow-inner">
                {messages.map((msg, i) => (
                    <MessageBubble key={i} text={msg.text} from={msg.from} />
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="flex gap-3 mt-4">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 bg-white/20 text-white placeholder-white/70 border border-white/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur-md"
                    placeholder="Ask something like: What is my career path?"
                />
                <button
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-bold px-5 py-3 rounded-xl hover:scale-105 active:scale-95 transition transform"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;