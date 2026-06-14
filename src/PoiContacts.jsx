// Rendering Contacts card

function ShelterCard({ shelter, onAction, onCardClick, isFavorite, onToggleFavorite, isActive }) {
  const tags = shelter.tags || {};
  const name = tags.name || 'Unknown Shelter';
  const address = [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']].filter(Boolean).join(' ') || 'No address provided';
  const phone = tags['contact:phone'] || tags.phone;
  const website = tags['contact:website'] || tags.website;
  const email = tags['contact:email'] || tags.email;
  const lat = shelter.lat || (shelter.center && shelter.center.lat);
  const lon = shelter.lon || (shelter.center && shelter.center.lon);
 
  const handleShare = async (e) => {
    e.stopPropagation(); // Prevent card click event
    if (navigator.share) {
      await navigator.share({ title: name, url: website || window.location.href });
    }
  };

  return (
    <div 
      // Add dynamic styling to highlight the card if the map pin is active
      className={`shelter-card ${isActive ? 'active-highlight' : ''}`}
      onClick={() => onCardClick(shelter)}
        style={{ 
          cursor: 'pointer', 
          border: isActive ? '2px solid #007AFF' : '1px solid #ddd',
          boxShadow: isActive ? '0 4px 12px rgba(0,122,255,0.2)' : 'none',
          transition: 'all 0.2s ease-in-out',
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: '#fff'
        }}>

      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>{name}</h3>
        <button 
          className={`heart-btn ${isFavorite ? 'is-fav' : ''}`} 
          onClick={() => onToggleFavorite(shelter)}
        >
          ❤️
      </button>
      </div>

      {address && <p style={{ color: '#666', margin: '8px 0', fontSize: '0.9rem' }}>📍 {address}</p>}
      
      {/* Action Buttons Row */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
        {phone && (
          <a href={`tel:${phone}`} onClick={(e) => e.stopPropagation()} 
             style={{ background: '#f0f0f0', padding: '6px 12px', borderRadius: '20px', textDecoration: 'none', color: '#333', fontSize: '0.85rem', fontWeight: '600' }}>
            📞 Call
          </a>
        )}
        <button onClick={handleShare} 
                style={{ background: '#f0f0f0', border: 'none', padding: '6px 12px', borderRadius: '20px', color: '#333', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
          ↗ Share
        </button>
      </div>

      <div className="card-contacts">
        { website && (
          <div className="contact-item">
            <strong>Website:</strong>{' '}
            <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">
              {website}
            </a>
          </div>
        )}
        { phone && (
          <div className="contact-item">
            <strong>Phone:</strong> <a href={`tel:${phone}`}>{phone}</a>
          </div>
        )}
        { email && (
          <div className="contact-item">
            <strong>Email:</strong>{' '}
            <form action={`mailto:${email}`} method="POST" encType="text/plain" style={{ display: 'inline' }}>
              <button type="submit" className="email-link-btn">
                {email}
              </button>
            </form>
          </div>
        )}
        {tags.opening_hours && (
          <div className="contact-item">
            <strong>Hours:</strong> {tags.opening_hours}
          </div>
        )}
        <div className="contact-item location-data" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed #eee', fontSize: '0.8rem', color: '#888' }}>
          <strong>Location:</strong> {lat?.toFixed(5)}, {lon?.toFixed(5)}
          <div style={{ marginTop: '4px', display: 'flex', gap: '10px' }}>
            <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary-accent)', textDecoration: 'none', fontWeight: 'bold' }}>
              📍 Google Maps
            </a>
            <a href={`https://maps.apple.com/?q=${lat},${lon}`} target="_blank" rel="noopener noreferrer" style={{ color: '#007AFF', textDecoration: 'none', fontWeight: 'bold' }}>
              🍎 Apple Maps
            </a>
          </div>
        </div>
      <div className="card-actions">

        <button className="view-on-map-btn" onClick={() => onAction(shelter)}>
          View on Map
        </button>
      </div>

      </div>
    </div>
    
  );
}


export default ShelterCard;

