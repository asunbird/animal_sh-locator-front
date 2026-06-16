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
                favorites.map((shelter) => {
                    const tags = shelter.tags || {};
                    const name = tags.name || t('unknownShelter');
                    const address = [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']]
                        .filter(Boolean)
                        .join(' ') || t('noAddress');

                    return (
                        <div key={shelter.id} className="fav-list-card">
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                <div>
                                    <h3>{name}</h3>
                                    
                                </div>
                                <button className="heart-btn is-fav" onClick={() => toggleFavorite(shelter)}>
                                    ✕
                                </button>
                            </div>
                            <p style={{ margin: '8px 0', color: '#666' }}>{address}</p>
                            {tags.opening_hours && (
                                <p style={{ margin: '4px 0', fontSize: '0.95rem' }}>
                                    <strong>{t('hours')}:</strong> {tags.opening_hours}
                                </p>
                            )}
                            <div style={{ marginTop: '8px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {tags.website && (
                                    <a href={tags.website.startsWith('http') ? tags.website : `https://${tags.website}`} target="_blank" rel="noopener noreferrer">
                                        {t('website')}
                                    </a>
                                )}
                                {tags.phone && (
                                    <a href={`tel:${tags.phone}`}>
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