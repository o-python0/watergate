import React, { useMemo } from "react";
import { TokenIcon } from "../../assets/icons";

interface RoundCapturedTokensProps {
  capturedTokens?: string[];
  className?: string;
}

const RoundCapturedTokens: React.FC<RoundCapturedTokensProps> = ({
  capturedTokens = [],
  className = "",
}) => {
  // トークンの数をカウント
  const { initiativeCount, powerCount } = useMemo(() => {
    let initiative = 0;
    let power = 0;

    capturedTokens.forEach((token) => {
      if (token === "initiative") initiative++;
      if (token === "power") power++;
    });

    return { initiativeCount: initiative, powerCount: power };
  }, [capturedTokens]);

  return (
    <div className={`bg-gray-200 p-1 rounded ${className}`}>
      <div className="flex items-center gap-2 mt-1">
        {/* イニシアチブトークン (白) */}
        {initiativeCount > 0 && (
          <div className="flex items-center">
            <TokenIcon
              size={20}
              color="#ffffff"
              count={initiativeCount}
              textColor="#000000"
            />
          </div>
        )}

        {/* 勢力トークン (赤) */}
        {powerCount > 0 && (
          <div className="flex items-center">
            <TokenIcon
              size={20}
              color="#c0392b"
              count={powerCount}
              textColor="#ffffff"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoundCapturedTokens;
