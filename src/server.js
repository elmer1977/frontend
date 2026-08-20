const defaultServer = "https://motocross-earthen-shrewdly.ngrok-free.dev/api/v2";
const defaultBackendUrl = "https://motocross-earthen-shrewdly.ngrok-free.dev/";

const apiBaseUrl =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  defaultServer;

const backendBaseUrl =
  process.env.REACT_APP_BACKEND_BASE_URL ||
  process.env.REACT_APP_API_ORIGIN ||
  defaultBackendUrl;

export const server = apiBaseUrl;
export const backend_url = backendBaseUrl.endsWith("/")
  ? backendBaseUrl
  : `${backendBaseUrl}/`;
export const socketEndpoint =
  process.env.REACT_APP_SOCKET_URL ||
  (backendBaseUrl.endsWith("/")
    ? backendBaseUrl.slice(0, -1)
    : backendBaseUrl);
