import React, { useState } from 'react';
import { BiSearchAlt2 } from "react-icons/bi";
import { BsRobot } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import OtherUsers from './OtherUsers';
import Chat from './Chatai';
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';
import QRCode from 'qrcode';

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [showChatBot, setShowChatBot] = useState(false);
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [qrUrl] = useState("https://pankesh-meena-portfolio.vercel.app/"); // Replace with your real URL
  const [qrDataUrl, setQrDataUrl] = useState(null);

  const { otherUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/user/logout`);
      navigate("/login");
      toast.success(res.data.message);
      dispatch(setAuthUser(null));
      dispatch(setMessages(null));
      dispatch(setOtherUsers(null));
      dispatch(setSelectedUser(null));
    } catch (error) {
      console.log(error);
    }
  };

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    const conversationUser = otherUsers?.find((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase())
    );
    if (conversationUser) {
      dispatch(setOtherUsers([conversationUser]));
    } else {
      toast.error("User not found!");
    }
  };

  const toggleQrPopup = async () => {
    if (!showQRPopup) {
      try {
        const dataUrl = await QRCode.toDataURL(qrUrl);
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error("QR Code error", err);
      }
    }
    setShowQRPopup(!showQRPopup);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'your-website-qr.png';
    link.click();
  };

  return (
    <div className='border-r border-slate-500 p-4 flex flex-col relative'>
      {/* Search and Menu */}
      <form onSubmit={searchSubmitHandler} className='flex items-center gap-2 relative'>
        <button type="button" onClick={toggleQrPopup} className="text-2xl text-gray-600">
          <FiMenu />
        </button>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='input input-bordered rounded-md'
          type='text'
          placeholder='Search...'
        />
        <button type='submit' className='btn bg-zinc-700 text-white'>
          <BiSearchAlt2 className='w-6 h-6 outline-none' />
        </button>

        {/* QR Code Popup */}
        {showQRPopup && (
          <div className="absolute top-12 left-0 bg-white shadow-lg border p-3 rounded-lg z-50 w-48">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold">Scan to Visit</h2>
              <button onClick={() => setShowQRPopup(false)} className="text-red-500">✕</button>
            </div>
            {qrDataUrl ? (
              <>
                <img src={qrDataUrl} alt="QR Code" className='w-full h-auto mb-2' />
                <button
                  onClick={handleDownloadQR}
                  className='btn btn-sm w-full text-white bg-blue-600 hover:bg-blue-700'
                >
                  Download QR
                </button>
              </>
            ) : (
              <p>Generating...</p>
            )}
          </div>
        )}
      </form>

      <div className='divider px-3'></div>
      <OtherUsers />

      {/* Logout & ChatBot Button */}
      <div className='mt-4 flex justify-between items-center'>
        <button onClick={logoutHandler} className='btn btn-sm'>
          Logout
        </button>
        <button
          onClick={() => setShowChatBot(true)}
          className='btn btn-sm flex items-center gap-2'
        >
          <BsRobot className='w-5 h-5 text-blue-600' />
          ChatBot
        </button>
      </div>

      {/* ChatBot Modal */}
      {showChatBot && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg p-4 w-full max-w-md h-[60vh] relative'>
            <button
              onClick={() => setShowChatBot(false)}
              className='absolute top-2 right-2 text-gray-500 hover:text-black'
            >
              ✕
            </button>
            <h2 className='text-lg font-semibold mb-2 text-center'>AI ChatBot</h2>
            <Chat />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
