import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, User, Search, Send, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Messages = () => {
  const { user, api } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => { fetchConversations(); }, [api]);

  useEffect(() => {
    if (activeChat) fetchMessages(activeChat);
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data.conversations || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const res = await api.get(`/messages/${otherUserId}`);
      setChatMessages(res.data.messages || []);
    } catch (err) { console.error(err); }
  };

  const handleSend = async () => {
    if (!message.trim() || !activeChat) return;
    try {
      setSending(true);
      await api.post('/messages', { receiverId: activeChat, content: message });
      setMessage('');
      await fetchMessages(activeChat);
      await fetchConversations();
    } catch (err) { toast.error('Failed to send message'); } finally { setSending(false); }
  };

  const startNewChat = async () => {
    try {
      const endpoint = user.role === 'student' ? '/companies' : '/students';
      const res = await api.get(endpoint);
      setUsers(res.data.profiles || []);
      setShowNewChat(true);
    } catch (err) { toast.error('Failed to load users'); }
  };

  const selectNewChatUser = (userId) => {
    setActiveChat(userId);
    setShowNewChat(false);
  };

  const getActiveName = () => {
    const conv = conversations.find(c => c.otherUser?._id === activeChat);
    return conv?.otherUser?.name || 'Chat';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <button onClick={startNewChat} className="btn-primary px-4 py-2 flex items-center gap-2 text-sm">
          <Plus size={16} /> New Message
        </button>
      </div>

      <div className="flex-grow bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex h-[600px]">
        {/* Contacts Sidebar */}
        <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search messages..." className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all" />
            </div>
          </div>
          <div className="overflow-y-auto flex-grow">
            {conversations.length === 0 && !loading ? (
              <div className="p-8 text-center text-slate-400">
                <MessageSquare className="mx-auto mb-2" size={32} />
                <p className="text-sm">No conversations yet</p>
                <button onClick={startNewChat} className="text-indigo-600 text-sm mt-2 hover:underline">Start one</button>
              </div>
            ) : conversations.map(conv => (
              <div
                key={conv._id}
                onClick={() => setActiveChat(conv.otherUser?._id)}
                className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors flex gap-3 ${activeChat === conv.otherUser?._id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                  <User size={20} />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-slate-900 truncate">{conv.otherUser?.name}</h3>
                    <span className="text-xs text-slate-500 flex-shrink-0">{conv.otherUser?.role}</span>
                  </div>
                  <p className="text-sm truncate text-slate-500">{conv.lastMessage?.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col bg-white">
          {showNewChat ? (
            <div className="flex-grow flex flex-col p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Start New Conversation</h3>
                <button onClick={() => setShowNewChat(false)}><X size={20} /></button>
              </div>
              <input type="text" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input mb-4" />
              <div className="overflow-y-auto flex-grow space-y-2">
                {users.filter(u => u.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.companyName?.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                  <div key={u._id} onClick={() => selectNewChatUser(u.user?._id)} className="p-3 rounded-xl border border-slate-100 hover:bg-indigo-50 cursor-pointer flex items-center gap-3 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><User size={18} /></div>
                    <div>
                      <p className="font-semibold text-slate-900">{u.companyName || u.user?.name}</p>
                      <p className="text-xs text-slate-500">{u.user?.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeChat ? (
            <>
              <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><User size={18} /></div>
                <h3 className="font-semibold text-slate-900">{getActiveName()}</h3>
              </div>
              <div className="flex-grow p-6 overflow-y-auto bg-slate-50 flex flex-col gap-4">
                {chatMessages.map(msg => (
                  <div key={msg._id} className={`flex flex-col max-w-[70%] ${msg.sender?._id === user.id || msg.sender === user.id ? 'self-end items-end' : 'self-start items-start'}`}>
                    <div className={`p-3 rounded-2xl ${msg.sender?._id === user.id || msg.sender === user.id ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'}`}>
                      {msg.content}
                    </div>
                    <span className="text-xs text-slate-400 mt-1 mx-1">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-slate-200 bg-white">
                <div className="flex items-center gap-2">
                  <input type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type your message..." className="flex-grow input py-3 rounded-full bg-slate-100 border-transparent focus:bg-white" />
                  <button onClick={handleSend} disabled={sending} className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex-shrink-0">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-400 bg-slate-50">
              <MessageSquare size={64} className="mb-4 text-slate-300" />
              <p className="text-lg font-medium text-slate-500">Select a conversation or start a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
