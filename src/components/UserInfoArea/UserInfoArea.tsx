// src/components/UserInfoArea.tsx
import React from "react";
import UserInfo from "./UserInfo";
import InformantsArea from "./InformantsArea";
import { useGame } from "../../contexts/GameContexts";

const UserInfoArea: React.FC = () => {
  const { capturedTokens } = useGame();

  return (
    <div className="h-full flex flex-col">
      {/* ニクソン側プレイヤー情報（上部） */}
      <div className="h-1/4 mb-2 min-h-[150px]">
        <UserInfo playerType="nixon" />
      </div>

      {/* 情報提供者エリア（中央） */}
      <div className="flex-grow my-2 min-h-[200px]">
        <InformantsArea />
      </div>

      {/* 編集者側プレイヤー情報（下部） */}
      <div className="h-1/4 mt-2 min-h-[150px]">
        <UserInfo playerType="editor" />
      </div>
    </div>
  );
};

export default UserInfoArea;
