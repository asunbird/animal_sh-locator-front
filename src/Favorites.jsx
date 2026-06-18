import { Link } from "react-router-dom";
import { useSaveFavorites } from './hooks/useSaveFavorites'; // Import hook
import logoIcon from '/src/assets/Logo-PetMap.svg'; // Import icons
import { useTranslation } from 'react-i18next'; // Import useTranslation


function FavoritesList() {
    // Initialize translation hook
    const { t } = useTranslation();

    // Grab the favorites array and the toggle function from your hook
    const { favorites, toggleFavorite } = useSaveFavorites();

    return (
        <section id="favorites-list-container">
            <header>
                <div>
                    <Link className="home-btn" to="/">
                        <img className="logo-icon" src={logoIcon} alt="Pet Map Logo" />
                    </Link> 
                </div> 

               <nav className="nav-links jost-700"> 
                    <Link className="nav-sections" to="/map">{t('backToMap')}</Link>
                </nav>
            </header>
            <h2 className="jost-700">{t('favoritesList')}</h2>

            {favorites.length === 0 ? (
                <div className="fav-list-card">{t('noFavorites')}</div>
            ) : (
                favorites.map((favorite) => {
                    const shelterId = favorite.id || favorite._id;
                    const tags = favorite.tags || {};
                    const shelter = favorite.shelter || {};

                    // Handle both formats: new format (direct properties) and old format (tags)
                    const name = favorite.name || shelter.name || tags.name || t('unknownShelter');
                    const address = favorite.address ||
                        ([tags['addr:housenumber'], tags['addr:street'], tags['addr:city']]
                            .filter(Boolean)
                            .join(' ')) ||
                        t('noAddress');
                    const phone = favorite.phone || shelter.phone || tags.phone;
                    const website = favorite.website || shelter.website || tags.website;
                    const hours = favorite.hours || shelter.hours || tags.opening_hours;

                    console.log('[Favorites] Displaying:', { name, address, phone, website, hours });

                    return (
                        <div key={shelterId} className="fav-list-card">
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                <div>
                                    <h3>{name}</h3>

                                </div>
                                <button className="heart-btn is-fav" onClick={() => toggleFavorite(favorite)}>
                                    ✕
                                </button>
                            </div>
                            <p style={{ margin: '8px 0', color: '#666' }}>{address}</p>
                            {hours && (
                                <p style={{ margin: '4px 0', fontSize: '0.95rem' }}>
                                    <strong>{t('hours')}:</strong> {hours}
                                </p>
                            )}
                            <div style={{ marginTop: '8px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {website && (
                                    <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">
                                        {t('website')}
                                    </a>
                                )}
                                {phone && (
                                    <a href={`tel:${phone}`}>
                                        {t('call')}
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
            
        </section>
    )
}

export default FavoritesList;