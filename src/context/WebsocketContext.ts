import { createContext } from "react";
import { Socket, io } from "socket.io-client";
import { environment } from "../environments/environment";
let socket: Socket | null = null;

const access_token = sessionStorage.getItem("access_token");
if (access_token && !socket) {
  InitializeSocket();
}
export function InitializeSocket(access_token?: string) {
  const jwtToken = access_token || sessionStorage.getItem("access_token");
  socket = io(`${environment?.wsHost}/auth`, {
    transports: ["websocket"],
    path: environment?.wsPath,
    autoConnect: true,
    auth: {
      token: `Bearer ${jwtToken}`,
    },
  });
}

export { socket }; // Export the socket variable
export const WebsocketContext = createContext<Socket | null>(socket);
export const WebsocketProvider = WebsocketContext.Provider;
