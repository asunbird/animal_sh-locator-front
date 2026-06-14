import { Marker, Popup } from 'react-leaflet';

function ShelterMarkerCard({ shelter, icon, isFavorite, toggleFavorite }) {
    const tags = shelter.tags || {};
    const name = tags.name || 'Unknown Shelter';
    const website = tags['contact:website'] || tags.website;
    const phone = tags['contact:phone'] || tags.phone;
    const email = tags['contact:email'] || tags.email;
    const openingHours = tags.opening_hours;

    // Extract address information if available
    const street = tags['addr:street'];
    const houseNum = tags['addr:housenumber'];
    const city = tags['addr:city'];
    const address = [houseNum, street, city].filter(Boolean).join(' ');

    // Support both nodes (direct lat/lon) and ways/relations (center property)
    const lat = shelter.lat || (shelter.center && shelter.center.lat);
    const lon = shelter.lon || (shelter.center && shelter.center.lon);

    if (!lat || !lon) return null;

    return (
        // Fallback to avoid passing undefined to Leaflet
        <Marker key={shelter.id} position={[lat, lon]} {...(icon ? { icon } : {})}>
            <Popup>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div>
                        <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>{name}</h3>
                    </div>
                    <button 
                        className={`heart-btn ${isFavorite(shelter.id) ? 'is-fav' : ''}`}
                        onClick={() => toggleFavorite(shelter)}
                        title={isFavorite(shelter.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                        ❤️
                    </button>
                </div>
                {address && (
                    <p style={{ margin: '4px 0', color: '#666', fontSize: '0.9rem' }}>
                        {address}
                    </p>
                )}
                <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }} />
                {website && (
                    <p style={{ margin: '4px 0' }}>
                        <strong>Website:</strong>{' '}
                        <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">
                            {website}
                        </a>
                    </p>
                )}
                {phone && (
                    <p style={{ margin: '4px 0' }}>
                        <strong>Phone:</strong> <a href={`tel:${phone}`}>{phone}</a>
                    </p>
                )}
                {email && (
                    <div style={{ margin: '4px 0' }}>
                        <strong>Email:</strong>{' '}
                        <form action={`mailto:${email}`} method="POST" encType="text/plain" style={{ display: 'inline' }}>
                            <button type="submit" className="email-link-btn">
                                {email}
                            </button>
                        </form>
                    </div>
                )}
                {openingHours && (
                    <p style={{ margin: '4px 0' }}>
                        <strong>Hours:</strong> {openingHours}
                    </p>
                )}
                <div style={{ margin: '8px 0', fontSize: '0.8rem', color: '#888', background: '#f9f9f9', padding: '8px', borderRadius: '4px' }}>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>Coordinates: {lat.toFixed(5)}, {lon.toFixed(5)}</strong>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary-accent)', fontWeight: 'bold', textDecoration: 'none' }}>
                            🚗 Google Maps
                        </a>
                        <a href={`https://maps.apple.com/?q=${lat},${lon}`} target="_blank" rel="noopener noreferrer" style={{ color: '#007AFF', fontWeight: 'bold', textDecoration: 'none' }}>
                            🍎 Apple Maps
                        </a>
                    </div>
                </div>

                <div style={{ marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '8px', textAlign: 'center' }}>
                    <a 
                        href={`https://www.openstreetmap.org/${shelter.type}/${shelter.id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.75rem', color: '#999', textDecoration: 'none' }}
                    >
                        ℹ️ View or Edit on OpenStreetMap
                    </a>
                </div>
            </Popup>
        </Marker>
    );
}

export default ShelterMarkerCard;
