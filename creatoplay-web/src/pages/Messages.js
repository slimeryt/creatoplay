import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FiSend, FiSearch, FiMessageCircle } from 'react-icons/fi';
import './Messages.css';

function Messages() {
  const { currentUser, userProfile } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Load conversations
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const convos = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const otherUserId = data.participants.find(id => id !== currentUser.uid);
        
        // Get other user's info
        const userDoc = await getDoc(doc(db, 'users', otherUserId));
        const otherUser = userDoc.exists() ? userDoc.data() : { username: 'Unknown' };
        
        convos.push({
          id: docSnap.id,
          ...data,
          otherUser: { id: otherUserId, ...otherUser }
        });
      }
      setConversations(convos);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Load messages for active chat
  useEffect(() => {
    if (!activeChat) return;

    const q = query(
      collection(db, 'conversations', activeChat.id, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [activeChat]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      await addDoc(collection(db, 'conversations', activeChat.id, 'messages'), {
        text: newMessage,
        senderId: currentUser.uid,
        senderName: userProfile?.username || 'Unknown',
        timestamp: serverTimestamp()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    return date.toLocaleDateString();
  };

  return (
    <div className="messages-page">
      <div className="conversations-list">
        <div className="conversations-header">
          <h2>Messages</h2>
        </div>
        <div className="conversations-search">
          <FiSearch />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="conversations">
          {conversations.length === 0 ? (
            <div className="no-conversations">
              <FiMessageCircle size={32} />
              <p>No messages yet</p>
            </div>
          ) : (
            conversations.map((convo) => (
              <div
                key={convo.id}
                className={`conversation-item ${activeChat?.id === convo.id ? 'active' : ''}`}
                onClick={() => setActiveChat(convo)}
              >
                <div className="convo-avatar" style={{ backgroundColor: convo.otherUser.avatar?.torsoColor || '#4a90d9' }}>
                  {convo.otherUser.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="convo-info">
                  <span className="convo-name">{convo.otherUser.username}</span>
                  <span className="convo-preview">{convo.lastMessage || 'No messages'}</span>
                </div>
                <span className="convo-time">{formatDate(convo.lastMessageTime)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-area">
        {activeChat ? (
          <>
            <div className="chat-header">
              <div className="chat-user-avatar" style={{ backgroundColor: activeChat.otherUser.avatar?.torsoColor || '#4a90d9' }}>
                {activeChat.otherUser.username?.[0]?.toUpperCase() || '?'}
              </div>
              <span className="chat-user-name">{activeChat.otherUser.username}</span>
            </div>
            <div className="chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.senderId === currentUser.uid ? 'sent' : 'received'}`}
                >
                  <div className="message-bubble">
                    <p>{msg.text}</p>
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form className="chat-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" disabled={!newMessage.trim()}>
                <FiSend />
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <FiMessageCircle size={48} />
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the list to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;