import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import { BASE_URL } from '..'; // Make sure this is your backend base URL

const Message = ({ message, onlineUsers }) => {
    const scroll = useRef();
    const { authUser, selectedUser } = useSelector((store) => store.user);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    const isSender = message?.senderId === authUser?._id;
    const isRecipientOnline = onlineUsers?.includes(selectedUser?._id);
    const formattedTime = message?.updatedAt
        ? format(new Date(message.updatedAt), 'hh:mm a')
        : '';

    // ✅ Seen/Delivered/Sent icon logic (like WhatsApp)
    const getSeenIcon = () => {
        if (!isSender) return null;

        if (message.seen) {
            return <FaCheckDouble className="text-blue-500 text-xs" title="Seen" />;
        } else if (isRecipientOnline) {
            return <FaCheckDouble className="text-gray-400 text-xs" title="Delivered (Online)" />;
        } else {
            return <FaCheck className="text-gray-400 text-xs" title="Sent (Offline)" />;
        }
    };

    // 📎 Media Renderer (image, video, audio, PDF, DOCX, XLSX, etc.)
    const renderMedia = (mediaPath, mediaType) => {
        const fullUrl = `${BASE_URL}${mediaPath}`;

        if (!mediaType) {
            return (
                <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                    Download File
                </a>
            );
        }

        if (mediaType.startsWith('image/')) {
            return <img src={fullUrl} alt="media" className="rounded-lg max-w-xs object-cover shadow" />;
        } else if (mediaType.startsWith('video/')) {
            return <video controls src={fullUrl} className="rounded-lg max-w-xs" />;
        } else if (mediaType.startsWith('audio/')) {
            return (
                <audio controls className="w-60">
                    <source src={fullUrl} />
                    Your browser does not support the audio element.
                </audio>
            );
        } else if (
            mediaType === 'application/pdf' ||
            mediaType === 'application/msword' ||
            mediaType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || // .docx
            mediaType === 'application/vnd.ms-excel' ||
            mediaType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
        ) {
            const label = mediaType.split('/')[1].toUpperCase();
            const icon = '📄';
            return (
                <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-3xl">{icon}</span>
                        <span className="text-sm text-white">{label} File</span>
                    </div>
                    <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        View / Download
                    </a>
                </div>
            );
        } else {
            // Fallback for unknown types
            return (
                <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                    Download File
                </a>
            );
        }
    };

    return (
        <div ref={scroll} className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}>
            {/* 👤 Avatar */}
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img
                        src={isSender ? authUser?.profilePhoto : selectedUser?.profilePhoto}
                        alt="profile"
                    />
                </div>
            </div>

            {/* ⏰ Timestamp */}
            <div className="chat-header">
                <time className="text-xs opacity-50 text-white">{formattedTime}</time>
            </div>

            {/* 💬 Message Bubble */}
            <div
                className={`chat-bubble max-w-xs flex flex-col gap-2 ${
                    !isSender ? 'bg-gray-200 text-black' : ''
                }`}
            >
                {/* 📄 Message Text */}
                {message?.message && (
                    <p className="whitespace-pre-wrap break-words">{message.message}</p>
                )}

                {/* 📎 Media File */}
                {message?.media && renderMedia(message.media, message.mediaType)}

                {/* ✅ Seen Icon (Sender only) */}
                {isSender && (
                    <div className="flex justify-end items-center gap-1 mt-1">
                        {getSeenIcon()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;
