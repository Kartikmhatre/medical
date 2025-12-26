import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, User, X, MessageSquare, ChevronDown, Loader2, Mic, Phone, PhoneOff, Volume2 } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { analyzeSymptoms } from '../services/geminiService';
import { ChatMessage } from '../types';

// --- Audio Utilities for Live API ---
function createBlob(data: Float32Array) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return {
    data: btoa(binary),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Text Formatting Utilities ---
const parseBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const FormattedText = ({ text, isUser }: { text: string, isUser: boolean }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;
        
        // Handle Bullet Points
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className={`text-[10px] mt-1.5 ${isUser ? 'text-slate-300' : 'text-primary-500'}`}>●</span>
              <span>{parseBold(trimmed.substring(2))}</span>
            </div>
          );
        }
        
        return <p key={i} className="min-h-[1em]">{parseBold(line)}</p>;
      })}
    </div>
  );
};

export const AIChecker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat');
  
  // Chat State
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi there! I'm Aura's AI assistant.\n\nI can help you understand your symptoms or answer general health questions.\n\n**Disclaimer:** I am an AI, not a doctor. Please consult a professional for medical advice.",
      timestamp: new Date()
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Voice State
  const [isCallActive, setIsCallActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'connecting' | 'active' | 'error'>('idle');
  const [audioVolume, setAudioVolume] = useState(0); // For visualizer

  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourceNodesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, activeTab]);

  // Cleanup audio on unmount or close
  useEffect(() => {
    return () => {
      stopCall();
    };
  }, []);

  // --- Text Chat Logic ---
  const handleSend = async () => {
    if (!input.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsChatLoading(true);

    try {
      const responseText = await analyzeSymptoms(input);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- Voice Call Logic (Gemini Live) ---
  const startCall = async () => {
    try {
      setVoiceStatus('connecting');
      setIsCallActive(true);

      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("No API Key");

      const ai = new GoogleGenAI({ apiKey });
      
      // Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      
      const outputNode = audioContextRef.current.createGain();
      outputNode.connect(audioContextRef.current.destination);

      // Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setVoiceStatus('active');
            
            // Setup Input Processing (Mic -> Model)
            if (!inputAudioContextRef.current) return;
            
            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Simple volume meter logic
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / inputData.length);
              setAudioVolume(Math.min(rms * 5, 1)); // Scale for visualizer

              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Output Audio (Model -> Speaker)
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                ctx,
                24000,
                1
              );

              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              
              source.addEventListener('ended', () => {
                sourceNodesRef.current.delete(source);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourceNodesRef.current.add(source);
            }
          },
          onclose: () => {
            setVoiceStatus('idle');
            stopCall();
          },
          onerror: (e) => {
            console.error(e);
            setVoiceStatus('error');
            stopCall();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: "You are Aura Health's advanced medical voice assistant. Listen to the user's symptoms and provide empathetic, concise, and helpful guidance. You can speak in any language the user speaks. Always clarify you are an AI.",
        }
      });

      sessionRef.current = sessionPromise;

    } catch (error) {
      console.error("Failed to start call:", error);
      setVoiceStatus('error');
      setIsCallActive(false);
    }
  };

  const stopCall = () => {
    // 1. Close Session
    if (sessionRef.current) {
        sessionRef.current.then((session: any) => session.close());
        sessionRef.current = null;
    }
    // 2. Stop Processor & Stream
    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    // 3. Stop Audio Sources
    sourceNodesRef.current.forEach(source => source.stop());
    sourceNodesRef.current.clear();

    // 4. Close Contexts
    if (inputAudioContextRef.current) {
        inputAudioContextRef.current.close();
        inputAudioContextRef.current = null;
    }
    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    
    setIsCallActive(false);
    setVoiceStatus('idle');
    setAudioVolume(0);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto bg-white w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[80vh] rounded-3xl shadow-2xl shadow-primary-900/20 border border-slate-100 flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-slate-900 p-4 shrink-0">
               <div className="flex items-center justify-between text-white mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Sparkles size={20} className="text-primary-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">Aura AI Assistant</h3>
                      <p className="text-xs text-slate-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        Online
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setIsOpen(false); if(isCallActive) stopCall(); }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <ChevronDown size={20} />
                  </button>
               </div>

               {/* Tabs */}
               <div className="flex bg-slate-800/50 p-1 rounded-xl">
                 <button
                   onClick={() => setActiveTab('chat')}
                   className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                     activeTab === 'chat' 
                       ? 'bg-white text-slate-900 shadow-md' 
                       : 'text-slate-400 hover:text-white'
                   }`}
                 >
                   <MessageSquare size={16} /> Chat
                 </button>
                 <button
                   onClick={() => setActiveTab('voice')}
                   className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                     activeTab === 'voice' 
                       ? 'bg-white text-slate-900 shadow-md' 
                       : 'text-slate-400 hover:text-white'
                   }`}
                 >
                   <Volume2 size={16} /> Voice Call
                 </button>
               </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col">
              
              {/* === CHAT MODE === */}
              {activeTab === 'chat' && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                          msg.role === 'user' ? 'bg-slate-200 text-slate-700' : 'bg-primary-100 text-primary-700'
                        }`}>
                          {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm max-w-[80%] leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-slate-900 text-white rounded-tr-none' 
                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                        }`}>
                          <FormattedText text={msg.text} isUser={msg.role === 'user'} />
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
                          <Bot size={14} />
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-2">
                          <Loader2 size={14} className="animate-spin text-primary-600" />
                          <span className="text-xs text-slate-500">Thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                    <form 
                      onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-100 outline-none transition-all placeholder:text-slate-400"
                      />
                      <button
                        type="submit"
                        disabled={isChatLoading || !input.trim()}
                        className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors"
                      >
                        <Send size={18} />
                      </button>
                    </form>
                  </div>
                </>
              )}

              {/* === VOICE MODE === */}
              {activeTab === 'voice' && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 to-slate-800 text-white relative overflow-hidden">
                   {/* Background Glow */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-500/10 rounded-full blur-[60px] pointer-events-none" />
                   
                   {/* Status Text */}
                   <div className="absolute top-8 left-0 right-0 text-center">
                      <p className="text-sm font-medium tracking-widest uppercase text-primary-200 opacity-80">
                         {voiceStatus === 'idle' && 'Voice Mode Ready'}
                         {voiceStatus === 'connecting' && 'Establishing Connection...'}
                         {voiceStatus === 'active' && 'Live Conversation'}
                         {voiceStatus === 'error' && 'Connection Failed'}
                      </p>
                   </div>

                   {/* Visualizer Orb */}
                   <div className="relative mb-12 mt-8">
                      {voiceStatus === 'active' ? (
                        <div className="relative w-32 h-32 flex items-center justify-center">
                           {/* Pulsing Rings */}
                           {[...Array(3)].map((_, i) => (
                             <motion.div
                               key={i}
                               animate={{ 
                                 scale: [1, 1.2 + (audioVolume * 0.5), 1],
                                 opacity: [0.3, 0.1, 0.3] 
                               }}
                               transition={{ 
                                 duration: 1.5, 
                                 repeat: Infinity, 
                                 delay: i * 0.4,
                                 ease: "easeInOut"
                               }}
                               className="absolute inset-0 rounded-full border border-primary-400/30 bg-primary-500/5"
                             />
                           ))}
                           {/* Core */}
                           <motion.div
                             animate={{ scale: [1, 1.05 + audioVolume, 1] }}
                             className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-400 to-teal-300 shadow-[0_0_40px_rgba(45,212,191,0.4)] flex items-center justify-center relative z-10"
                           >
                              <Mic className="text-white" size={32} />
                           </motion.div>
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-slate-700/50 border border-slate-600 flex items-center justify-center">
                           <Mic className="text-slate-400" size={32} />
                        </div>
                      )}
                   </div>

                   {/* Action Buttons */}
                   <div className="w-full max-w-[200px] flex flex-col gap-4 relative z-20">
                      {voiceStatus === 'active' || voiceStatus === 'connecting' ? (
                        <button
                          onClick={stopCall}
                          className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all hover:scale-105"
                        >
                          <PhoneOff size={20} /> End Call
                        </button>
                      ) : (
                        <button
                          onClick={startCall}
                          className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 transition-all hover:scale-105 animate-pulse"
                        >
                          <Phone size={20} /> Start Call
                        </button>
                      )}
                      
                      <p className="text-xs text-center text-slate-400 mt-2">
                         {voiceStatus === 'idle' ? "Tap to start speaking" : "Tap 'End Call' to finish"}
                      </p>
                   </div>
                </div>
              )}
            </div>

            {/* Footer Notice */}
            <div className="bg-slate-50 p-2 text-[10px] text-center text-slate-400 border-t border-slate-100">
               Aura AI is an experimental tool. Consult a doctor.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl shadow-slate-900/30 hover:bg-slate-800 transition-colors z-50 relative group"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full border-2 border-white animate-pulse"></span>
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        
        {/* Tooltip */}
        <span className="absolute right-full mr-4 bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Talk to Aura AI
        </span>
      </motion.button>
    </div>
  );
};