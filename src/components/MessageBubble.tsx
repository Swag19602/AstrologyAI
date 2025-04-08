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
            className={clx('flex mb-4 items-center', {
                'justify-end': isUser,
                'justify-start': !isUser,
            })}
        >
            {/* Emoji / Avatar */}
            {!isUser && (
                <span className="mr-3 text-2xl flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full shadow-lg">
                    🤖
                </span>
            )}
            {isUser && (
                <span className="ml-3 text-2xl flex items-center justify-center w-8 h-8 bg-yellow-500 text-white rounded-full shadow-lg">
                    🧑‍💻
                </span>
            )}

            <div
                className={clx(
                    'max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-lg',
                    {
                        // User bubble: vibrant gradient with white text
                        'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white': isUser,

                        // Bot bubble: cooler gradient with light gray text
                        'bg-gradient-to-br from-purple-700 via-purple-500 to-pink-500 text-gray-100': !isUser,
                    }
                )}
            >
                <ReactMarkdown
                    components={{
                        h1: ({ node, ...props }) => (
                            <h1 {...props} className="text-lg font-bold mb-2" />
                        ),
                        h2: ({ node, ...props }) => (
                            <h2 {...props} className="text-base font-semibold mb-1" />
                        ),
                        strong: ({ node, ...props }) => (
                            <strong {...props} className="font-semibold" />
                        ),
                        li: ({ node, ...props }) => (
                            <li {...props} className="list-disc list-inside" />
                        ),
                        p: ({ node, ...props }) => <p {...props} className="mb-2" />,
                    }}
                >
                    {text}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
};

export default MessageBubble;