import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../services/axios.js";
import L from "leaflet";

// Créer une icône personnalisée avec Font Awesome
const createIcon = (color) => {
    return new L.Icon({
        iconUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="40" height="40" fill="${color}"><path d="M172.3 501.7C40.1 295.5 0 271.4 0 192 0 86 86 0 192 0s192 86 192 192c0 79.4-40.1 103.5-172.3 309.7-9.6 15-32.8 15-42.4 0zM192 256a64 64 0 100-128 64 64 0 000 128z"/></svg>`,
        iconSize: [30, 45],
        iconAnchor: [15, 45],
        popupAnchor: [0, -40],
    });
};

export default function MapView() {
    const [position, setPosition] = useState([-21.4607787, 47.106983]);
    const [interventions, setInterventions] = useState([]);

    useEffect(() => {
        const fetchInterventions = async () => {
            try {
                const response = await api.get('/interventions.localisation', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });

                setInterventions(response.data.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des interventions:", error);
            }
        };

        fetchInterventions();

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
            <Marker position={position} icon={createIcon('green')}>
                <Popup>Tu es ici ! 📍</Popup>
            </Marker>
            {interventions.map(intervention => (
                <Marker
                    key={intervention.id}
                    position={[parseFloat(intervention.latitude), parseFloat(intervention.longitude)]}
                    icon={createIcon('red')} // Utiliser l'icône rouge pour les interventions
                >
                    <Popup>
                        <div>
                            <h3>{intervention.typeintervention}</h3>
                            <p>Status: {intervention.status}</p>
                            <p>Date de demande: {new Date(intervention.datedemand).toLocaleString()}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}