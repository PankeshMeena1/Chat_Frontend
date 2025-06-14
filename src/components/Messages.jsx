import React from 'react';
import Message from './Message';
import { useSelector } from "react-redux";
import useGetMessages from '../hooks/useGetMessages';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Messages = () => {
    // Fetch messages and real-time message updates
    useGetMessages();
    useGetRealTimeMessage();

    // Get the messages and onlineUsers from the Redux store
    const { messages } = useSelector(store => store.message);
    const { onlineUsers } = useSelector(store => store.user);

    return (
        <div className='px-4 flex-1 overflow-auto'>
            {/* Loop through the messages and render each Message component */}
            {messages && messages.map((message) => (
                <Message
                    key={message._id}
                    message={message}
                    onlineUsers={onlineUsers}  // Pass onlineUsers to each Message
                />
            ))}
        </div>
    );
};

export default Messages;
