import React, { useState, useEffect, useRef } from 'react';
import { IoSend } from 'react-icons/io5';
import {
  FaMicrophone,
  FaPaperclip,
  FaSmile,
  FaHeadphones
} from 'react-icons/fa';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import EmojiPicker from 'emoji-picker-react';

const SendInput = () => {
  const [message, setMessage] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.user);
  const messages = useSelector(state => state.message.messages || []);

  const speechRecognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  const {
    startRecording,
    stopRecording,
    isRecording,
    recordingBlob
  } = useAudioRecorder();

  // -------------------- 🧠 Setup Browser Speech Recognition --------------------
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage((prev) => prev + ' ' + transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
    }
  }, []);

  // -------------------- 🎧 Whisper Speech-to-Text Toggle --------------------
  const toggleSpeechToText = async () => {
    if (!isRecording) {
      startRecording();
    } else {
      const blob = await stopRecording();
      if (blob) {
        sendAudioToWhisper(blob);
      }
    }
  };

  const sendAudioToWhisper = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'voice.webm');

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/voice-to-text`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.text) {
        setMessage(prev => prev + ' ' + res.data.text);
      }
    } catch (error) {
      console.error('Whisper API error:', error);
    }
  };

  // -------------------- 🧠 Native Voice-to-Text (Optional) --------------------
  const toggleNativeSpeechRecognition = () => {
    const recognition = speechRecognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  };

  // -------------------- 🎤 Voice Msg Recorder --------------------
  const handleVoiceRecording = () => {
    if (!isRecordingVoice) {
      startRecording();
      setIsRecordingVoice(true);
    } else {
      stopRecording().then((blob) => {
        setMediaFile(new File([blob], 'voiceMessage.webm', { type: 'audio/webm' }));
        setMediaPreviewUrl(URL.createObjectURL(blob));
      });
      setIsRecordingVoice(false);
    }
  };

  // -------------------- 📎 Media Handling --------------------
  const handleMediaClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaPreviewUrl(URL.createObjectURL(file));
    }
  };

  // -------------------- ✨ Emoji Handling --------------------
  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  // -------------------- 📤 Message Send Handler --------------------
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!message.trim() && !mediaFile) return;

    const formData = new FormData();
    formData.append('message', message);
    if (mediaFile) formData.append('file', mediaFile);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/message/send/${selectedUser?._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      dispatch(setMessages([...messages, res?.data?.newMessage]));
    } catch (error) {
      console.log('Error sending message', error);
    }

    setMessage('');
    setMediaFile(null);
    setMediaPreviewUrl(null);
  };

  return (
    <div className="px-4 py-3 bg-gray-800 rounded-lg shadow-md relative">
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-0 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
        </div>
      )}
      <form onSubmit={onSubmitHandler} className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-white text-xl hover:text-yellow-400"
          title="Emoji"
        >
          <FaSmile />
        </button>

        {/* 🎧 Whisper Speech-to-Text */}
        <button
          type="button"
          onClick={toggleSpeechToText}
          className={`text-lg ${isRecording ? 'text-green-500 animate-pulse' : 'text-white hover:text-green-400'}`}
          title="AI Voice to Text"
        >
          <FaHeadphones />
        </button>

        {/* 💬 Input */}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Send a message..."
          className="flex-grow border border-zinc-500 text-sm rounded-lg p-3 bg-gray-600 text-white placeholder-gray-300 focus:outline-none"
        />

        {/* 📎 Attach Media */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*,video/*,audio/*,application/pdf"
        />
        <button
          type="button"
          onClick={handleMediaClick}
          className="text-white text-lg hover:text-green-400 transition-colors"
          title="Attach File"
        >
          <FaPaperclip />
        </button>

        {/* 🎤 Voice Message Recording */}
        <button
          type="button"
          onClick={handleVoiceRecording}
          className={`text-lg transition-colors ${isRecordingVoice ? 'text-red-500 animate-pulse' : 'text-white hover:text-red-400'}`}
          title={isRecordingVoice ? 'Stop Recording' : 'Record Voice Message'}
        >
          {isRecordingVoice ? '...' : <FaMicrophone />}
        </button>

        <button
          type="submit"
          className="text-white text-xl hover:text-blue-400 transition-colors"
          title="Send"
        >
          <IoSend />
        </button>
      </form>

      {/* 📷 Media Preview */}
      {mediaPreviewUrl && (
        <div className="mt-3 w-full max-w-xs">
          <p className="text-white text-sm mb-1">Preview:</p>
          {mediaFile.type.startsWith('image') && (
            <img src={mediaPreviewUrl} alt="Preview" className="rounded-md" />
          )}
          {mediaFile.type.startsWith('video') && (
            <video controls className="rounded-md w-full">
              <source src={mediaPreviewUrl} type={mediaFile.type} />
            </video>
          )}
          {mediaFile.type.startsWith('audio') && (
            <audio controls>
              <source src={mediaPreviewUrl} type={mediaFile.type} />
            </audio>
          )}
          {!mediaFile.type.startsWith('image') &&
            !mediaFile.type.startsWith('video') &&
            !mediaFile.type.startsWith('audio') && (
              <div className="text-white bg-zinc-700 p-2 rounded-md">
                <p className="text-sm font-medium truncate">{mediaFile.name}</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SendInput;
