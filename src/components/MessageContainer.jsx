// import React from 'react';
// import SendInput from './SendInput';
// import Messages from './Messages';
// import { useSelector, useDispatch } from "react-redux";
// import { setSelectedUser } from '../redux/userSlice';
// import { FaPhoneAlt, FaVideo } from 'react-icons/fa';
// import { format, isToday, isYesterday } from 'date-fns';


// const MessageContainer = () => {
//     const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);

//     const { message } = useSelector(store => store.message)

//     console.log(message, "massdata")
//     console.log(selectedUser, "userdata")
    
//     const dispatch = useDispatch();

//     const isOnline = onlineUsers?.includes(selectedUser?._id);

//     const handleVoiceCall = () => {
//         console.log("Voice call started with", selectedUser?.fullName);
//     };

//     const handleVideoCall = () => {
//         console.log("Video call started with", selectedUser?.fullName);
//     };

//     const formatLastSeen = (dateString) => {
//         if (!dateString) return "Offline";

//         const date = new Date(dateString);

//         if (isToday(date)) {
//             return `Last seen today at ${format(date, 'p')}`;
//         } else if (isYesterday(date)) {
//             return `Last seen yesterday at ${format(date, 'p')}`;
//         } else {
//             return `Last seen on ${format(date, 'MMM d')} at ${format(date, 'p')}`;
//         }
//     };

//     return (
//         <>
//             {
//                 selectedUser !== null ? (
//                     <div className='md:min-w-[550px] flex flex-col'>
//                         {/* Header Section */}
//                         <div className='flex items-center justify-between bg-zinc-800 text-white px-4 py-2 mb-2'>
//                             <div className='flex gap-2 items-center'>
//                                 <div className={`avatar ${isOnline ? 'online' : ''}`}>
//                                     <div className='w-12 rounded-full'>
//                                         <img src={selectedUser?.profilePhoto} alt="user-profile" />
//                                     </div>
//                                 </div>
//                                 <div className='flex flex-col'>
//                                     <p className="font-medium">{selectedUser?.fullName}</p>
//                                     <span className="text-xs text-gray-400">
//                                         {isOnline ? 'Online' : formatLastSeen(message?.updatedAt)}
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Call Buttons */}
//                             <div className='flex gap-3'>
//                                 <button
//                                     onClick={handleVoiceCall}
//                                     title="Voice Call"
//                                     className="hover:text-green-400 transition-colors text-lg"
//                                 >
//                                     <FaPhoneAlt />
//                                 </button>
//                                 <button
//                                     onClick={handleVideoCall}
//                                     title="Video Call"
//                                     className="hover:text-blue-400 transition-colors text-lg"
//                                 >
//                                     <FaVideo />
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Chat and Input Section */}
//                         <Messages />
//                         <SendInput />
//                     </div>
//                 ) : (
//                     <div className='md:min-w-[550px] flex flex-col justify-center items-center'>
//                         <h1 className='text-4xl text-white font-bold'>Hi, {authUser?.fullName}</h1>
//                         <h1 className='text-2xl text-white'>Let's start a conversation</h1>
//                     </div>
//                 )
//             }
//         </>
//     );
// };

// export default MessageContainer;

import React from 'react';
import SendInput from './SendInput';
import Messages from './Messages';
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';
import { FaPhoneAlt, FaVideo } from 'react-icons/fa';
import { format, isToday, isYesterday } from 'date-fns';

const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
    const messages = useSelector(state => state.message.messages || []); // fallback if needed

    const dispatch = useDispatch();

    const isOnline = onlineUsers?.includes(selectedUser?._id);

    // Get last message for selected user
    const lastMessage = messages?.filter(msg =>
            msg?.senderId === selectedUser?._id ||
            msg?.receiverId === selectedUser?._id
        )
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]; // latest first

    const handleVoiceCall = () => {
        console.log("Voice call started with", selectedUser?.fullName);
    };

    const handleVideoCall = () => {
        console.log("Video call started with", selectedUser?.fullName);
    };

    const formatLastSeen = (dateString) => {
        if (!dateString) return "Offline";

        const date = new Date(dateString);

        if (isToday(date)) {
            return `Last seen today at ${format(date, 'p')}`;
        } else if (isYesterday(date)) {
            return `Last seen yesterday at ${format(date, 'p')}`;
        } else {
            return `Last seen on ${format(date, 'MMM d')} at ${format(date, 'p')}`;
        }
    };

    return (
        <>
            {
                selectedUser !== null ? (
                    <div className='md:min-w-[550px] flex flex-col'>
                        {/* Header Section */}
                        <div className='flex items-center justify-between bg-zinc-800 text-white px-4 py-2 mb-2'>
                            <div className='flex gap-2 items-center'>
                                <div className={`avatar ${isOnline ? 'online' : ''}`}>
                                    <div className='w-12 rounded-full'>
                                        <img src={selectedUser?.profilePhoto} alt="user-profile" />
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <p className="font-medium">{selectedUser?.fullName}</p>
                                    <span className="text-xs text-gray-400">
                                        {isOnline
                                            ? 'Online'
                                            : formatLastSeen(lastMessage?.updatedAt)}
                                    </span>
                                </div>
                            </div>

                            {/* Call Buttons */}
                            <div className='flex gap-3'>
                                <button
                                    onClick={handleVoiceCall}
                                    title="Voice Call"
                                    className="hover:text-green-400 transition-colors text-lg"
                                >
                                    <FaPhoneAlt />
                                </button>
                                <button
                                    onClick={handleVideoCall}
                                    title="Video Call"
                                    className="hover:text-blue-400 transition-colors text-lg"
                                >
                                    <FaVideo />
                                </button>
                            </div>
                        </div>

                        {/* Chat and Input Section */}
                        <Messages />
                        <SendInput />
                    </div>
                ) : (
                    <div className='md:min-w-[550px] flex flex-col justify-center items-center'>
                        <h1 className='text-4xl text-white font-bold'>Hi, {authUser?.fullName}</h1>
                        <h1 className='text-2xl text-white'>Let's start a conversation</h1>
                    </div>
                )
            }
        </>
    );
};

export default MessageContainer;

