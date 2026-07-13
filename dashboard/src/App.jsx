import { useEffect, useState } from "react";
import socket from "./services/socket";
import DeviceCard from "./components/DeviceCard";
import "./styles/style.css";

function App() {

    const [devices, setDevices] = useState([]);

    useEffect(() => {

        socket.emit("get-devices");

        socket.on("device-list", (list) => {
            setDevices(list);
        });

        return () => {
            socket.off("device-list");
        };

    }, []);

    return (

        <div className="container">

            <h1>ControlHub Dashboard</h1>

            {
                devices.length === 0
                ?
                <h2>No Devices Connected</h2>
                :
                devices.map(device => (
                    <DeviceCard
                        key={device.deviceId}
                        device={device}
                    />
                ))
            }

        </div>

    );

}

export default App;