import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import logoIcon from '/src/assets/Logo-PetMap.svg'; // Import icons
import gitHub from '/src/assets/GitHub.png'; // Import icons
import { useSaveFavorites } from './hooks/useSaveFavorites';


// Home component with header, main content, and footer
export function Home() {
    // 1. Track what the user types
    const [searchInput, setSearchInput] = useState('');
  
    // 2. Initialize the navigate function
    const navigate = useNavigate();

    // Grab favorites from the custom hook
    const { favorites } = useSaveFavorites();

    // 3. Create the onClick handler
    const handleSearchClick = () => {
        if (!searchInput.trim()) return; // Prevent searching if the input is empty
        // Navigate to the map page AND pass the search the search input in the background
        navigate('/map', { state: { requestedLocation: searchInput } }); 
    };

    const handlerFavoritesHomeClick = () => {
        navigate('/favorites');
    };


    return (
        <section id="home">
            <header>
                <div>
                    <img className="logo-icon" src={logoIcon} alt="Pet Map Logo" />
                </div>
                {/* Level Bage */}  
                <div id="level" className="level-badge">
                    <span>Level 1</span>
                    <div className="level-progress-bar">
                        <div className="progress-fill" style={{ width: '50%' }}></div>
                    </div>
                </div>
                {/* Language Switcher ES-EN */}
                <div id="lang" className="lang-switch-container">
                    <div id="lang-ES-btn" className="jost-700">ES</div>
                    <div className="lang-toggle-btn">
                        <div className="lang-toggle-point"></div>
                    </div>
                    <div id="lang-EN-btn" className=" jost-700">EN</div>
                </div>

                <nav className="nav-links jost-700"> 
                    <Link id="autorisation" to="/signin">
                        Sign in
                    </Link>
                     <Link id="profile-settings-link" to="profilesettings">
                        Profile Settings
                    </Link>
                    <Outlet/>
                </nav>    

                {/* Favorites buton */}
                <div className="fav-container flex-row">
                    <button className="nav-sections" id="favorites" style={{ textDecoration: 'none' }}
                        onClick={handlerFavoritesHomeClick} 
                        className="search-button" type="button" 
                        >
                            <div id="favorites-btn" >
                                <p id="favorites-count" className="icon-text libre-franklin-700">{favorites.length}</p>
                            </div>
                            <p className="libre-franklin-700" >
                            Favorites
                            </p>
                    </button>
                </div>
                
            </header>
            <main>
                <div className="home-content">
                    <h2 className="jost-700">FIND THE ANIMAL SHELTER NEAR YOU</h2>
                    <div className="search-bar-container">

                        {/* Updates a state when user types */}
                        <input
                            type="text"
                            placeholder="Enter a city or location"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            id="location-input"
                            className="search-input"
                            name="search"
                            required
                        />
                        {/* onClick event to Action Button */}
                        <button onClick={handleSearchClick} id="search-btn" 
                            className="search-button" type="button" >
                            Search
                        </button>
                    </div>
                </div>
            </main>

            <footer className="libre-franklin-700">
                © 2026 Pet Map |
                <img className="github" src={gitHub} alt="GitHub" />
                <a href="https://github.com/asunbird/Animal-shelters-Locator-Frontend" target="_blank" >
                    GitHub
                </a>
                 |
                <div className="nav-links libre-franklin-700">
                    <Link to="/about">About</Link>
                </div>
            </footer>
        </section>
    );
}

export function ProfileSettings() {
    return (
        <section id="profile-settings">
            <div id="prof-settings-container">
                <form id="user-contacts" action="">
                    <div>Personal contacts data</div>
                    <input type="text" placeholder="Username" /><br/>
                    <input type="password" placeholder="Password" /><br/>
                    <button type="submit" id="submit-btn" >
                        Save Changes
                    </button><br/>
                    <input type="email" placeholder="Email Address" /><br/>
                    <button type="button">Reset Password</button>
                </form><br/>
                <div id="favorites-settings">
                    <div id="level-settings" className="libre-franklin-700">Favorites list Settings</div>
                    <button type="button">Share Favorites list</button>
                </div><br/>
                <div id="level-settings" className="libre-franklin-700">Level Settings</div><br/>
                 <button className="libre-franklin-700" type="button">
                    <Link to="/">Close X</Link>   
                </button>
            </div>
        </section>
    )
}


const HomeCmponents =()=>{
}
export default HomeCmponents;

