import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Paperclip, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! 👋 How can I help you with your project today?", sender: 'bot', time: 'Just now' }
    ]);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newUserMsg = { id: Date.now(), text: message, sender: 'user', time: 'Now' };
        setMessages(prev => [...prev, newUserMsg]);
        setMessage('');

        // Simulate reply
        // Simulate "typing" then reply
        setTimeout(() => {
            const botReply = {
                id: Date.now() + 1,
                text: "Thanks for reaching out! 30-minute delivery is our guarantee. A support agent will verify your location shortly.",
                sender: 'bot',
                time: 'Now'
            };
            setMessages(prev => [...prev, botReply]);
        }, 2000);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 size-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:brightness-110 border-4 border-white"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X size={28} strokeWidth={3} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                        >
                            <MessageCircle size={32} strokeWidth={2.5} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="fixed bottom-28 right-6 z-50 w-[90vw] max-w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden origin-bottom-right"
                    >
                        {/* Header */}
                        <div className="p-4 bg-primary text-white flex items-center gap-3 shadow-sm">
                            <div className="relative">
                                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <MessageCircle size={20} />
                                </div>
                                <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-primary"></div>
                            </div>
                            <div>
                                <h3 className="font-black text-sm">Customer Support</h3>
                                <p className="text-xs opacity-80 font-medium">Online • Replies instantly</p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-primary text-white rounded-br-none'
                                            : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none shadow-sm'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 font-bold px-1">{msg.time}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex items-end gap-2">
                            <button type="button" className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
                                <Paperclip size={20} />
                            </button>
                            <div className="flex-1 bg-gray-100 rounded-xl flex items-center px-3 border border-transparent focus-within:border-primary/50 transition-colors">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none py-3 text-sm focus:ring-0 text-gray-900 placeholder:text-gray-400"
                                />
                                <button type="button" className="p-1 px-2 text-gray-400 hover:text-primary transition-colors">
                                    <Smile size={18} />
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="p-3 bg-primary text-white rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget;
