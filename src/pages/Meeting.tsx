import { useEffect, useState } from "react";
import {
    LiveKitRoom,
    VideoConference
} from "@livekit/components-react";
import "@livekit/components-styles";

export default function Meeting() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const user = crypto.randomUUID()

        fetch(`${import.meta.env.VITE_API_URL}/meeting/token?room=test&user=${user}`)
            .then((res) => res.json())
            .then((data) => setToken(data.token));
    }, []);

    if (!token) return <div>Connecting...</div>;

    return (
        <LiveKitRoom
            connect={true}
            video={true}
            audio={true}
            token={token}
            serverUrl={import.meta.env.VITE_LIVEKIT_URL}
            style={{ height: "100vh" }}
        >
            <VideoConference />
        </LiveKitRoom>
    );
}