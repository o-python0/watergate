import { PlayerRole } from "../constants/types";
import { getCardsByRole } from "./card";

const mockApi = {
  cards: {
    // roleクエリパラメータに応じたレスポンスを返す
    get: (query: { role?: string }) => {
      const role = query.role as PlayerRole;
      return {
        cards: getCardsByRole(role),
      };
    },
  },
};

export default mockApi;
