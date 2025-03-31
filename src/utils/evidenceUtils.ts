import { EvidenceGraph } from "../types/evidenceBoard.types";

/**
 * 情報提供者からニクソンへの独立した経路を見つける
 * @param graph 証拠グラフ
 * @param informantId 情報提供者のID
 * @param nixonId ニクソンのID
 * @param requiredPaths 必要な経路数（デフォルト: 2）
 * @returns 勝利結果と独立経路のリスト
 */
export function findIndependentPaths(
  graph: EvidenceGraph,
  informantId: string,
  nixonId: string,
  requiredPaths: number = 2
): { isVictory: boolean; paths: string[][] } {
  // グラフの表現を隣接リストに変換（ニクソン所有ノードは除外）
  const connections: Record<string, string[]> = {};

  // 有効なノードの初期化（ニクソン所有ノードは除外）
  Object.values(graph.nodes).forEach((node) => {
    if (node.owner !== "nixon") {
      connections[node.id] = [];
    }
  });

  // 接続リストの構築
  Object.values(graph.nodes).forEach((node) => {
    if (node.owner !== "nixon") {
      node.connections.forEach((targetId) => {
        if (graph.nodes[targetId] && graph.nodes[targetId].owner !== "nixon") {
          connections[node.id].push(targetId);
        }
      });
    }
  });

  // 独立経路を探索
  const paths: string[][] = [];
  let workingGraph = JSON.parse(JSON.stringify(connections));

  while (paths.length < requiredPaths) {
    const path = findPath(workingGraph, informantId, nixonId);
    if (!path || path.length < 2) break;
    paths.push(path);
    removePathFromGraph(workingGraph, path);
  }

  return {
    isVictory: paths.length >= requiredPaths,
    paths: paths,
  };
}

/**
 * 幅優先探索でグラフ内の経路を見つける
 * @param graph 隣接リスト形式のグラフ
 * @param start 開始ノード
 * @param end 終了ノード
 * @returns 経路が見つかった場合はノードIDの配列、見つからない場合はnull
 */
function findPath(
  graph: Record<string, string[]>,
  start: string,
  end: string
): string[] | null {
  // 開始ノードまたは終了ノードがグラフに存在しない場合
  if (!graph[start] || !graph[end]) {
    return null;
  }

  const queue: string[] = [start];
  const visited: Record<string, boolean> = { [start]: true };
  const parent: Record<string, string | null> = { [start]: null };

  while (queue.length > 0) {
    const current = queue.shift()!;

    // 終了ノードに到達した場合、経路を再構築
    if (current === end) {
      const path: string[] = [];
      let node: string | null = current;

      while (node) {
        path.unshift(node);
        node = parent[node];
      }

      return path;
    }

    // 隣接ノードを訪問
    if (graph[current]) {
      for (const neighbor of graph[current]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          parent[neighbor] = current;
          queue.push(neighbor);
        }
      }
    }
  }

  // 経路が見つからなかった
  return null;
}

/**
 * 経路をグラフから削除（独立経路を見つけるため）
 * @param graph 操作対象のグラフ
 * @param path 削除する経路
 */
function removePathFromGraph(
  graph: Record<string, string[]>,
  path: string[]
): void {
  for (let i = 0; i < path.length - 1; i++) {
    const node = path[i];
    const nextNode = path[i + 1];

    // 双方向の接続を削除
    graph[node] = graph[node].filter((n) => n !== nextNode);
    graph[nextNode] = graph[nextNode].filter((n) => n !== node);
  }
}

/**
 * 勝利条件チェックが必要かどうかを判断
 * @param graph 証拠グラフ
 * @returns チェックが必要かどうか
 */
export function shouldCheckVictory(graph: EvidenceGraph): boolean {
  // 最小必要ノード数のチェック
  const journalistNodes = Object.values(graph.nodes).filter(
    (node) => node.owner !== "nixon"
  );

  if (journalistNodes.length < 4) {
    return false; // 勝利に必要なノード数に達していない
  }

  // 情報提供者とニクソンの識別
  const informantIds = Object.values(graph.nodes)
    .filter((node) => node.type === "informant")
    .map((node) => node.id);

  const nixonId = Object.values(graph.nodes).find(
    (node) => node.type === "nixon"
  )?.id;

  if (!nixonId || informantIds.length === 0) {
    return false; // 必要なノードが存在しない
  }

  // 基本的な接続性をチェック
  const connections: Record<string, string[]> = {};

  // 有効なノードの初期化
  Object.values(graph.nodes).forEach((node) => {
    if (node.owner !== "nixon") {
      connections[node.id] = [];
    }
  });

  // 接続リストの構築
  Object.values(graph.nodes).forEach((node) => {
    if (node.owner !== "nixon") {
      node.connections.forEach((targetId) => {
        if (graph.nodes[targetId] && graph.nodes[targetId].owner !== "nixon") {
          connections[node.id].push(targetId);
        }
      });
    }
  });

  let hasBasicConnectivity = false;

  for (const infId of informantIds) {
    if (findPath(connections, infId, nixonId)) {
      hasBasicConnectivity = true;
      break;
    }
  }

  return hasBasicConnectivity;
}
