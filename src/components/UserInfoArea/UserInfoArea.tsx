// src/components/UserInfoArea.tsx
import React from "react";
import UserInfo from "./UserInfo";
import InformantsArea from "./InformantsArea";

const UserInfoArea: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      {/* 相手側のプレイヤー情報 */}
      <div className="h-1/4 mb-2 min-h-[150px]">
        <UserInfo />
      </div>

      {/* 情報提供者エリア（中央） */}
      <div className="flex-grow my-2 min-h-[200px]">
        <InformantsArea />
      </div>

      {/* 自分側のプレイヤー情報 */}
      <div className="h-1/4 mt-2 min-h-[150px]">
        <UserInfo isLocalPlayer />
      </div>
    </div>
  );
};

export default UserInfoArea;
