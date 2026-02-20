
import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  title: string;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, title }) => {
  return (
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl overflow-hidden">
      <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white flex flex-col">
        {/* Status Bar */}
        <div className="bg-slate-100 px-6 py-2 flex justify-between items-center text-[10px] font-semibold text-slate-500">
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-3 h-2 bg-slate-400 rounded-sm"></div>
            <div className="w-3 h-3 border border-slate-400 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default PhoneFrame;
