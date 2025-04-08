import { motion } from 'framer-motion';
import { clx } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ text, from }: { text: string; from: 'user' | 'bot' }) => {
    const isUser = from === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={clx('flex mb-3', {
                'justify-end': isUser,
                'justify-start': !isUser,
            })}
        >
            <div
                className={clx(
                    'max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-lg',
                    {
                        // 🧑 User message: rich gradient with white text
                        'bg-gradient-to-br from-[#5b1fa6] via-[#a343ff] to-[#ff8a00] text-white': isUser,

                        // 🤖 Bot message: darker gradient with light gray text for better contrast
                        'bg-gradient-to-br from-[#2e1065] via-[#6b21a8] to-[#b83280] text-gray-200': !isUser,
                    }
                )}
            >
                <ReactMarkdown
                    components={{
                        p: ({ node, ...props }) => <p {...props} className="prose prose-sm" />,
                    }}
                >
                    {text}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
};

export default MessageBubble;