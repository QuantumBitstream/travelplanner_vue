let socket;
let messageCallback;

export function connectWebSocket(url) {
    socket = new WebSocket(url);

    socket.onopen = () => {
        console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
        if (messageCallback) {
            messageCallback(JSON.parse(event.data));
        }
    };

    socket.onclose = () => {
        console.log("WebSocket disconnected");
    };
}

export function sendMessage(message) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    }
}

export function onMessage(callback) {
    messageCallback = callback;
}
