import { Marker } from 'react-leaflet';

function ShelterMarkerPin({ shelter, icon, onMarkerClick, isActive }) {



    // Support both nodes (direct lat/lon) and ways/relations (center property)
    const lat = shelter.lat || (shelter.center && shelter.center.lat);
    const lon = shelter.lon || (shelter.center && shelter.center.lon);

    if (!lat || !lon) return null;


    return (
        // Fallback to avoid passing undefined to Leaflet
        <Marker 
            key={shelter.id} 
            position={[lat, lon]} 
            // Explicitly force Leaflet to use the passed pawIcon
            icon={icon}
            // Brings the clicked paw to the front and dims the others slightly
            // Highlight map pin dynamically via zIndex or opacity if isActive is true
            zIndexOffset={isActive ? 1000 : 0}
            opasity={isActive ? 1 : 0.6}
            eventHandlers={{
                click: () => {
                   if (onMarkerClick) onMarkerClick(shelter);
                }
            }}
        >   
        </Marker>
    );
}

export default ShelterMarkerPin;
