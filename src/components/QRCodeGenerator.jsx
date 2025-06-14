// import React, { useEffect, useRef } from 'react';
// import QRCode from 'qrcode';

// const QRCodeGenerator = () => {
//   const canvasRef = useRef();

//   useEffect(() => {
//     QRCode.toCanvas(canvasRef.current, "https://pankesh-meena-portfolio.vercel.app/", {
//       width: 200,
//     }, (error) => {
//       if (error) console.error(error);
//     });
//   }, []);

//   return (
//     <div className="flex flex-col items-center gap-2">
//       <h2 className="text-lg font-bold">Scan to Visit Our Website</h2>
//       <canvas ref={canvasRef} />
//     </div>
//   );
// };

// export default QRCodeGenerator;

// components/QRCodePopup.jsx
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator = ({ onClose }) => {
  const canvasRef = useRef();

  useEffect(() => {
    QRCode.toCanvas(canvasRef.current, "https://pankesh-meena-portfolio.vercel.app/", {
      width: 180,
    });
  }, []);

  return (
    <div className="absolute top-16 left-0 bg-white shadow-lg border p-4 rounded-lg z-50">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md font-bold">Scan to Visit Site</h2>
        <button onClick={onClose} className="text-red-500 text-sm">✕</button>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default QRCodeGenerator;
