import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

var socket = new SockJS("http://localhost:8080/api/socket");
export const stompClient = Stomp.over(socket);
