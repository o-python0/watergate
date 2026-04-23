// src/services/api.ts

// API基本URL（環境変数から取得）
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api";

// API呼び出しのデフォルトオプション
const defaultOptions: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
};

// APIリクエストの基本関数
async function fetchAPI<T>(
  endpoint: string,
  method: string = "GET",
  body?: any,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const requestOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    method,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    // 開発環境でのモックモード判定
    if (process.env.REACT_APP_USE_MOCK_API === "true") {
      console.log(`[MOCK API] ${method} ${endpoint}`);
      // モックデータを返す処理
      return await getMockResponse<T>(endpoint, method, body);
    }

    // 実際のAPI呼び出し
    const response = await fetch(url, requestOptions);

    // エラーレスポンスのハンドリング
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API request failed with status ${response.status}`
      );
    }

    // レスポンスをJSONとしてパース
    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`API request failed: ${error.message}`);
    } else {
      console.error(`API request failed: ${String(error)}`);
    }
    throw error;
  }
}

// モックレスポンス取得関数
async function getMockResponse<T>(
  endpoint: string,
  method: string,
  body?: any
): Promise<T> {
  // モックデータをインポート
  const mockData = await import("../mocks").then((module) => module.default);

  // パスとクエリを解析
  const [path, queryString] = endpoint.split("?");
  const pathParts = path.split("/").filter(Boolean);
  const resource = pathParts[0]; // 例: 'cards'

  // クエリパラメータを解析
  const query: Record<string, string> = {};
  if (queryString) {
    queryString.split("&").forEach((pair) => {
      const [key, value] = pair.split("=");
      query[key] = value;
    });
  }

  // 型安全にリソースの存在を確認
  if (
    resource in mockData &&
    typeof (mockData as any)[resource][method.toLowerCase()] === "function"
  ) {
    return (mockData as any)[resource][method.toLowerCase()](query);
  }

  throw new Error(`Mock data not found for ${endpoint}`);
}

// 各HTTPメソッド用のヘルパー関数
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    fetchAPI<T>(endpoint, "GET", undefined, options),

  post: <T>(endpoint: string, body: any, options?: RequestInit) =>
    fetchAPI<T>(endpoint, "POST", body, options),

  put: <T>(endpoint: string, body: any, options?: RequestInit) =>
    fetchAPI<T>(endpoint, "PUT", body, options),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchAPI<T>(endpoint, "DELETE", undefined, options),
};

export default api;
