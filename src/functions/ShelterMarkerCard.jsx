import { Marker, Popup } from 'react-leaflet';

function ShelterMarkerCard({ shelter, icon, onMarkerClick, isActive }) {

    // Support both nodes (direct lat/lon) and ways/relations (center property)
    const lat = shelter.lat || (shelter.center && shelter.center.lat);
    const lon = shelter.lon || (shelter.center && shelter.center.lon);

    if (!lat || !lon) return null;



    return (
        // Fallback to avoid passing undefined to Leaflet
        <Marker 
            key={shelter.id} 
            position={[lat, lon]} 
            {...(icon ? { icon } : {})}
            // Highlight map pin dynamically via zIndex or opacity if isActive is true
            zIndexOffset={isActive ? 1000 : 0}
            opasity={isActive ? 1 : 0.7}
            eventHandlers={{
                click: () => {
                   if (onMarkerClick) onMarkerClick(shelter);
                }
            }}
        >
            <Popup minWidth={260}>
               <strong>{shelter.tags?.name || 'Unknown Shelter'}</strong>
            </Popup>
        </Marker>
    );
}

export default ShelterMarkerCard;
