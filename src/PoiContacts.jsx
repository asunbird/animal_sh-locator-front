import { useTranslation } from 'react-i18next'; // Import useTranslation

// Rendering Contacts card
export default function ShelterCard({ shelter, onCardClick, isFavorite, onToggleFavorite, isActive }) {
  // Initialize translation hook
  const { t } = useTranslation();
  
  const tags = shelter.tags || {};
  const name = tags.name || t('unknownShelter');
  const address = [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']].filter(Boolean).join(' ') || t('noAddress');
  const phone = tags['contact:phone'] || tags.phone;
  const website = tags['contact:website'] || tags.website;
  const email = tags['contact:email'] || tags.email;
  const lat = shelter.lat || (shelter.center && shelter.center.lat);
  const lon = shelter.lon || (shelter.center && shelter.center.lon);
 
  const handleShare = async (e) => {
    e.stopPropagation(); // Prevent card click event
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url: website || window.location.href });
      } catch (error) {
        // Only log the error if it's NOT the user canceling the share dialog
        if (error.name !== 'AbortError') console.error("Error sharing:", error);
      }
    } else {
      alert(t('sharingNotSupported'));
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
          boxShadow: isActive ? '0 4px 12px rgba(0,122,255,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          pointerEvents: 'auto',
          // Changed to dynamically adjust height based on active state
          minHeight: isActive ? '140px' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
    >

      {/* 1. ALWAYS VISIBLE: Name and Coordinates */}
      <div className="card-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{name}</h3>
          <p style={{ margin: '0', fontSize: '0.8rem', color: '#888' }}>
            📍 {lat?.toFixed(5)}, {lon?.toFixed(5)}
          </p> 
        </div>

      {/* 2. EXPANDED VIEW: Rendered only when card is active */}
      {isActive && (
        <div className="expanded-content" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
          
          <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#555' }}>📍 {address}</p>

          {/* Action Buttons Row */}
          <div className="card-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            
            <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`} 
              target="_blank" rel="noopener noreferrer" 
              style={actionBtnStyle}
              onClick={(e) => e.stopPropagation()}
            >
              📍 Google Maps
            </a>
            <a href={`https://maps.apple.com/?q=${lat},${lon}`} 
              target="_blank" rel="noopener noreferrer" 
              style={actionBtnStyle}
              onClick={(e) => e.stopPropagation()}
            >
              🍎 Apple Maps
            </a>

            {/* Call */}
            {phone && (
              <a href={`tel:${phone}`} 
                style={actionBtnStyle}
                onClick={(e) => e.stopPropagation()} 
              >
                📞 {t('call')}
              </a>
            )}

            {/* Save/Favorite */}
            <button 
              style={actionBtnStyle}
              className={`heart-btn ${isFavorite ? 'is-fav' : ''}`} 
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(shelter);
              }}
              >
                ❤️
            </button>

            {/* Share */}
            <button style={actionBtnStyle}
              onClick={(e) => {
                e.stopPropagation();
                handleShare(e);
              }}
            >
              ↗ {t('share')}
            </button>
          </div>

          {/* Contacts Data */}
          <div className="card-contacts">
            { website && (
              <div className="contact-item">
                <strong>{t('website')}:</strong>{' '}
                <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">
                  {website}
                </a>
              </div>
            )}
            { phone && (
              <div className="contact-item">
                <strong>{t('phone')}:</strong> <a href={`tel:${phone}`}>{phone}</a>
              </div>
            )}
            { email && (
              <div className="contact-item">
                <strong>{t('email')}:</strong>{' '}
                <form action={`mailto:${email}`} method="POST" encType="text/plain" style={{ display: 'inline' }}>
                  <button type="submit" className="email-link-btn">
                    {email}
                  </button>
                </form>
              </div>
            )}
            {tags.opening_hours && (
              <div className="contact-item">
                <strong>{t('hours')}:</strong> {tags.opening_hours}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Simple styling object for the buttons
const actionBtnStyle = {
  background: '#f1f3f4',
  border: 'none',
  borderRadius: '8px',
  padding: '6px 10px',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  color: '#3c4043',
  textDecoration: 'none',
  cursor: 'pointer',
  display: 'inline-block'
};
