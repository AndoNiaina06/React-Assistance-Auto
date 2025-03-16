import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView() {
    const [position, setPosition] = useState([-21.4607787, 47.106983]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.watchPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition([latitude, longitude]);
                },
                (error) => console.error("Erreur de géolocalisation:", error),
                { enableHighAccuracy: true }
            );
        }
    }, []);

    return (
        <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
                <Popup>Tu es ici ! 📍</Popup>
            </Marker>
        </MapContainer>
    );
}
