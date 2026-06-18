import { useState } from 'react';
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // 1. Import useTranslation
import logoIcon from '/src/assets/Logo-PetMap.svg'; // Import icons
import gitHub from '/src/assets/GitHub.png'; // Import icons
import { useSaveFavorites } from './hooks/useSaveFavorites';
import { useAuth } from './hooks/useAuth';
import LevelBadge from './LevelBadge.jsx';
import './LevelBadge.css';


// Home component with header, main content, and footer
function Home() {

    // Initialize translation hook
    const { t, i18n } = useTranslation();

    // Track what the user types
    const [searchInput, setSearchInput] = useState('');
  

    // Initialize the navigate function
    const navigate = useNavigate();

    // Grab favorites from the custom hook
    const { favorites } = useSaveFavorites();

    const { token, setToken } = useAuth();

    // get tocken from local storge
    console.log("Token from context:", token);

    const handleSignOut = () => {
        setToken(null);
        navigate('/');
    };

    // Create the onClick handler
    const handleSearchClick = () => {
        if (!searchInput.trim()) return; // Prevent searching if the input is empty

        // Passing the search input to the map.
        // Navigate to the map page AND pass the search the search input in the background
        // If backend needs to know the language of the search, you can pass i18n.language here too.
        navigate('/map', { 
            state: { 
                requestedLocation: searchInput,
                searchLanguage: i18n.language // Added language context for the search function
             } 
            }); 
    };

    const handlerFavoritesHomeClick = () => {
        navigate('/favorites');
    };

        {/*
        // Track selected language
        const [userLanguage, setUserLanguage] = useState('ES');
        */}

        // Update the language toggle handler
        const handleLangToggle = (e) => {
            const selectedLanguage = e.target.value.toLowerCase(); // 'es' or 'en'
            i18n.changeLanguage(selectedLanguage);
            // console.log(`User language changed to: ${selectedLanguage.toUpperCase()}`);
        };
            {/*
            setUserLanguage(selectedLanguage);

            if (selectedLanguage === "ES") {
                console.log(`User language changed to: ${selectedLanguage}`); 
            } else if (selectedLanguage === "EN") {
                console.log(`User language changed to: ${selectedLanguage}`);
            } else {
                console.log("Error: Capture changes.");
            }
            */}
        
            // Derived state for the toggle visual dot
            const isEnglish = i18n.resolvedLanguage?.startsWith('en');


    return (
        <section id="home">
            <header>
                <div>
                    <img className="logo-icon" src={logoIcon} alt="Pet Map Logo" />
                </div>

                {/* Level Badge - Translated */}  
                <LevelBadge />
                {/* 
                    <div className="level-up-6 flex-row">
                        <div><span>✨</span></div>
                        <div>
                            <span>Level Up!</span><span>You've reached Level 6</span>
                        </div>
                    </div>
                 */}  
                
                {/* Language Switcher ES-EN */}
                <div id="lang" className="lang-switch-container">
                    <button onClick={handleLangToggle} id="lang-ES-btn" className="lang-btns" value="ES">ES</button>
                    <div className="lang-toggle-btn">
                        <div className={`lang-toggle-point ${isEnglish ? "float-r" : "float-l"}`}></div>
                    </div>
                    <button onClick={handleLangToggle} id="lang-EN-btn" className="lang-btns" value="EN">EN</button>
                </div>

                <nav className="nav-links jost-700">
                    {token ? (
                        <button id="signout" className="nav-link-btn jost-700" onClick={handleSignOut}>
                            {t('signOut')}
                        </button>
                    ) : (
                        <Link id="autorisation" to="/components/signin">
                            {t('signIn')}
                        </Link>
                    )}
                    <Outlet/>
                </nav>

                {/* Favorites button - Translated */}
                <div className="fav-container flex-row">
                    <button id="favorites" style={{ textDecoration: 'none' }}
                        className="search-button nav-sections"
                        onClick={handlerFavoritesHomeClick} 
                        type="button" 
                        >
                            <div id="favorites-btn" >
                                <p id="favorites-count" className="icon-text libre-franklin-700">{favorites.length}</p>
                            </div>
                            <p className="libre-franklin-700" >
                                {t('favorites')}
                            </p>
                    </button>
                </div>
                
            </header>
            <main>
                <div className="home-content">
                    {/* Heading - Translated */}
                    <h2 className="jost-700">{t('heading')}</h2>
                    <div className="search-bar-container">
                        {/* Search Input Placeholder - Translated */}
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            id="location-input"
                            className="search-input"
                            name="search"
                            required
                        />
                        {/* Search Button - Translated (Action Button) */}
                        <button onClick={handleSearchClick} id="search-btn" 
                            className="search-button" type="button" >
                            {t('searchBtn')}
                        </button>
                    </div>
                </div>

                {/* Level Badge - CSS-Test container
                <div className="flex-row">
                    <div className="level-badge-0 level-badge">
                        <div className="flex-row">
                            <span>{t('level')}: </span><span>0</span>
                        </div>
                        <div className="level-progress-bar">
                            <div className="progress-fill" style={{ width: '50%'}}></div>
                        </div>
                    </div>

                    <div className="level-badge-1 level-badge">
                        <div className="flex-row">
                            <span>{t('level')}: </span><span>1</span>
                        </div>
                        <div className="level-progress-bar">
                            <div className="progress-fill" style={{ width: '50%'}}></div>
                        </div>
                    </div>
                    <div className="level-badge-2 level-badge">
                        <div className="flex-row">
                            <span>{t('level')}: </span><span>2</span>
                        </div>
                        <div className="level-progress-bar">
                            <div className="progress-fill" style={{ width: '50%'}}></div>
                        </div>
                    </div>
                    <div className="level-badge-3 level-badge">
                        <div className="flex-row">
                            <span>{t('level')}: </span><span>3</span>
                        </div>
                        <div className="level-progress-bar">
                            <div className="progress-fill" style={{ width: '50%'}}></div>
                        </div>
                    </div>
                    <div className="level-badge-4 level-badge">
                        <div className="flex-row">
                            <span>{t('level')}: </span><span>4</span>
                        </div>
                        <div className="level-progress-bar">
                            <div className="progress-fill" style={{ width: '50%'}}></div>
                        </div>
                    </div>
                    <div className="level-badge-5 level-badge">
                        <div className="flex-row">
                            <span>{t('level')}: </span><span>5</span>
                        </div>
                        <div className="level-progress-bar">
                            <div className="progress-fill" style={{ width: '50%'}}></div>
                        </div>
                    </div>
                    <div className="level-badge-6 level-badge">
                        <div className="flex-row">
                            <span>{t('level')}: </span><span>6</span>
                        </div>
                        <div className="level-progress-bar">
                            <div className="progress-fill" style={{ width: '50%'}}></div>
                        </div>
                    </div>
                </div>
                 */}

            </main>

            <footer className="libre-franklin-700">
                {t('footerMap')}
                <img className="github" src={gitHub} alt="GitHub" />
                <a href="https://github.com/asunbird/Animal-shelters-Locator-Frontend" target="_blank" rel="noreferrer">
                    GitHub
                </a>
                 |
                <div className="nav-links libre-franklin-700">
                    <Link to="/about">{t('about')}</Link>
                </div>
            </footer>
        </section>
    );
}


export default Home;

