import { Marker, Popup } from 'react-leaflet';

function ShelterMarkerCard({ shelter, icon, isFavorite, toggleFavorite, onMarkerClick }) {
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

    // Web Share API for native mobile sharing sheets
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: name,
                    text: `Check out ${name} on PetMap!`,
                    url: website || window.location.href,
                });
            } catch (error) {
                console.log('Share canceled or failed', error);
            }
        } else {
            alert("Sharing is not supported on this browser. You can copy the page URL!");
        }
    };

    return (
        // Fallback to avoid passing undefined to Leaflet
        <Marker 
            key={shelter.id} 
            position={[lat, lon]} 
            {...(icon ? { icon } : {})}
            eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(shelter)
            }}
        >
            <Popup minWidth={260}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', 
                    fontFamily: 'var(--font-family, system-ui, sans-serif)' }}
                >
                    {/* Header & Save Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#1a1a1a', fontWeight: '700', lineHeight: '1.3' }}>
                            {name}
                        </h3>
                        <button 
                            className={`heart-btn ${isFavorite(shelter.id) ? 'is-fav' : ''}`}
                            onClick={() => toggleFavorite(shelter)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', paddingLeft: '8px' }}
                            title={isFavorite(shelter.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                            ❤️
                        </button>
                    </div>
                    {/* Contact Details (Conditionally Rendered) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#4a4a4a' }}>
                        {address && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span>📍</span> <span>{address}</span>
                            </div>
                        )}
                        {openingHours && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span>🕒</span> <span>{openingHours}</span>
                            </div>
                        )}
                        {phone && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span>📞</span> 
                                <a href={`tel:${phone}`} style={{ color: '#007AFF', textDecoration: 'none', fontWeight: '600' }}>{phone}</a>
                            </div>
                        )}
                        {website && (
                            <p style={{ margin: '4px 0' }}>
                                <strong>Website:</strong>{' '}
                                <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">
                                    {website}
                                </a>
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
                    </div>
                    {/* Final Actions Row Endpoint */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
                         <a href={`https://maps.apple.com/?q=${lat},${lon}`} target="_blank" rel="noopener noreferrer" style={{ color: '#007AFF', fontWeight: 'bold', textDecoration: 'none' }}>
                            🍎 Apple Maps
                        </a>
                        <strong style={{ display: 'block', marginBottom: '4px' }}>Coordinates: {lat.toFixed(5)}, {lon.toFixed(5)}</strong>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary-accent)', fontWeight: 'bold', textDecoration: 'none' }}>
                            🚗 Google Maps
                            </a>
                        </div>
                        <button onClick={handleShare} style={{ flex: '0 0 auto', background: '#f1f3f4', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', color: '#3c4043' }}>
                            ↗ Share
                        </button>
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
