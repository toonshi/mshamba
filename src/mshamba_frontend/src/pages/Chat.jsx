import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, Smile, Phone, Video, MoreVertical, Search } from 'lucide-react';

export const Chat = ({ onBack }) => {
  const [activeChat, setActiveChat] = useState('john-kamau');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  const contacts = [
    {
      id: 'john-kamau',
      name: 'John Kamau',
      role: 'Farmer',
      farm: 'Green Valley Farm',
      avatar: '👨‍🌾',
      online: true,
      lastSeen: 'Online',
      unread: 2
    },
    {
      id: 'mary-wanjiku',
      name: 'Mary Wanjiku',
      role: 'Farmer',
      farm: 'Sunrise Coffee Estate',
      avatar: '👩‍🌾',
      online: false,
      lastSeen: '2 hours ago',
      unread: 0
    },
    {
      id: 'peter-mwangi',
      name: 'Peter Mwangi',
      role: 'Farmer',
      farm: 'Fresh Harvest Gardens',
      avatar: '👨‍🌾',
      online: true,
      lastSeen: 'Online',
      unread: 1
    },
    {
      id: 'support',
      name: 'M-Shamba Support',
      role: 'Support Team',
      farm: 'Customer Support',
      avatar: '🎧',
      online: true,
      lastSeen: 'Online',
      unread: 0
    }
  ];

  const conversations = {
    'john-kamau': [
      {
        id: 1,
        sender: 'john-kamau',
        message: 'Hello! Thank you for investing in Green Valley Farm. The maize is growing very well this season.',
        timestamp: '10:30 AM',
        type: 'text'
      },
      {
        id: 2,
        sender: 'me',
        message: 'That\'s great to hear! Can you share some photos of the current progress?',
        timestamp: '10:32 AM',
        type: 'text'
      },
      {
        id: 3,
        sender: 'john-kamau',
        message: 'Of course! Here are some recent photos from the field.',
        timestamp: '10:35 AM',
        type: 'text'
      },
      {
        id: 4,
        sender: 'john-kamau',
        message: 'We expect to harvest in about 2 months. The yield is looking very promising!',
        timestamp: '10:36 AM',
        type: 'text'
      },
      {
        id: 5,
        sender: 'me',
        message: 'Excellent! What about the weather conditions? Any concerns?',
        timestamp: '10:40 AM',
        type: 'text'
      },
      {
        id: 6,
        sender: 'john-kamau',
        message: 'Weather has been perfect. We had good rains last month and now sunny days for growth.',
        timestamp: '11:15 AM',
        type: 'text'
      },
      {
        id: 7,
        sender: 'john-kamau',
        message: 'I\'ll send weekly updates with photos and progress reports.',
        timestamp: '11:16 AM',
        type: 'text'
      }
    ],
    'mary-wanjiku': [
      {
        id: 1,
        sender: 'mary-wanjiku',
        message: 'Good morning! Coffee harvest season is approaching. Expected yield is 20% higher than last year.',
        timestamp: '8:45 AM',
        type: 'text'
      },
      {
        id: 2,
        sender: 'me',
        message: 'That\'s fantastic news! When do you expect to start harvesting?',
        timestamp: '9:00 AM',
        type: 'text'
      },
      {
        id: 3,
        sender: 'mary-wanjiku',
        message: 'We should start in about 3 weeks. I\'ll keep you updated on the exact dates.',
        timestamp: '9:15 AM',
        type: 'text'
      }
    ],
    'peter-mwangi': [
      {
        id: 1,
        sender: 'peter-mwangi',
        message: 'Hi! The vegetables are ready for harvest. Would you like to visit the farm this weekend?',
        timestamp: '2:30 PM',
        type: 'text'
      },
      {
        id: 2,
        sender: 'me',
        message: 'I\'d love to visit! What time works best for you?',
        timestamp: '2:45 PM',
        type: 'text'
      }
    ],
    'support': [
      {
        id: 1,
        sender: 'support',
        message: 'Welcome to M-Shamba! How can we help you today?',
        timestamp: '9:00 AM',
        type: 'text'
      }
    ]
  };

  const activeContact = contacts.find(c => c.id === activeChat);
  const messages = conversations[activeChat] || [];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.farm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-900 text-white w-full">
      <div className="flex h-screen">
        {/* Sidebar - Contacts List */}
        <div className="w-1/3 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setActiveChat(contact.id)}
                className={`w-full p-4 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 ${
                  activeChat === contact.id ? 'bg-gray-700' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-xl">
                      {contact.avatar}
                    </div>
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{contact.name}</h3>
                      {contact.unread > 0 && (
                        <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">{contact.farm}</p>
                    <p className="text-xs text-gray-500">{contact.lastSeen}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-lg">
                      {activeContact.avatar}
                    </div>
                    {activeContact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{activeContact.name}</h3>
                    <p className="text-sm text-gray-400">{activeContact.farm} • {activeContact.lastSeen}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'me'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'me' ? 'text-green-100' : 'text-gray-400'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-gray-800 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Paperclip className="w-5 h-5 text-gray-400" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:border-green-500"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="p-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p className="text-gray-400">Choose a contact to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};