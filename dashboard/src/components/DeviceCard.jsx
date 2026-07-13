import { useState, useEffect } from "react";
import socket from "../services/socket";

function DeviceCard({ device }) {
    
    const [screen, setScreen] = useState(null);

    const [webcam, setWebcam] = useState(null);

    useEffect(() => {

        socket.on("screen-update", (data) => {

            if (data.deviceId === device.deviceId) {
                setScreen(data.image);
            }

        });

        socket.on("webcam-image", (data) => {

            if (data.deviceId === device.deviceId) {
                setWebcam(data.image);
            }

        });

        return () => {
            socket.off("screen-update");
            socket.off("webcam-image");
        };

    }, [device.deviceId]);

    const refreshScreen = () => {
        socket.emit("request-screenshot", device.deviceId);
    };

    const requestWebcam = () => {
        socket.emit("request-webcam", device.deviceId);
    };

    const shutdown = () => {
        socket.emit("shutdown", device.deviceId);
    };

    const restart = () => {
        socket.emit("restart", device.deviceId);
    };

    const lock = () => {
        socket.emit("lock", device.deviceId);
    };

    return (

        <div className="device-card">

            <div className="device-header">

                <h2>{device.name}</h2>

                <span className="online">🟢 Online</span>

            </div>

            <div className="info">

                <p><strong>OS</strong> : {device.os} {device.release}</p>

                <p><strong>CPU</strong> : {device.cpu}%</p>

                <p><strong>RAM</strong> : {device.ram}%</p>

                <p><strong>Disk</strong> : {device.disk}%</p>

                <p><strong>Battery</strong> : {device.battery ?? "N/A"}%</p>

                <p><strong>IP</strong> : {device.local_ip}</p>

            </div>

                {
                    screen && (
                        <img
                            src={`data:image/jpeg;base64,${screen}`}
                            className="screen"
                            alt="Live Screen"
                        />
                    )
                }

                {
                    webcam && (
                        <img
                            src={`data:image/jpeg;base64,${webcam}`}
                            className="screen"
                            alt="Webcam"
                        />
                    )
                }

            <div className="buttons">

                <button onClick={refreshScreen}>
                    Refresh Screen
                </button>

                <button onClick={requestWebcam}>
                    Capture Webcam
                </button>

                <button className="shutdown" onClick={shutdown}>
                    Shutdown
                </button>

                <button className="restart" onClick={restart}>
                    Restart
                </button>

                <button className="lock" onClick={lock}>
                    Lock
                </button>

            </div>

        </div>

    );

}

export default DeviceCard;