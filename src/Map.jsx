import { useState, useEffect, useCallback } from 'react'; // <-- Added useCallback
import { Link } from "react-router-dom";
import logoIcon from '/src/assets/Logo-PetMap.svg'; // Import icons

// Import the Map Container for Leaflet
import { MapContainer, TileLayer } from 'react-leaflet'
import ShelterCard from './PoiContacts.jsx';
import ShelterMarkerCard from './functions/ShelterMarkerCard.jsx';

import { useSaveFavorites } from './hooks/useSaveFavorites.js';
import { useLocationSearch } from './hooks/useLocationSearch'; // <-- Location search hook

// Fix for default marker icon in leaflet with bundler
import L from 'leaflet';
import pawIcon from './assets/point.svg';
import 'leaflet/dist/leaflet.css';
let DefaultIcon = L.icon({
    iconUrl: pawIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Rendering a Map
function Map() {
    // 1. All state variables
    const [searchQuery, setSearchQuery] = useState('');
    const [map, setMap] = useState(null); // Assuming save leaflet map instance here
    const [isLoadingShelters, setIsLoadingShelters] = useState(false);

    const [activeShelterId, setActiveShelterId] = useState(null);

    const { favorites, toggleFavorite, isFavorite } = useSaveFavorites();
    const [hasSearched, setHasSearched] = useState(false);
    const [initialMapCenter, setInitialMapCenter] = useState([40.417840, -3.688085]);

    const [isSearching, setIsSearching] = useState(false);
    const [shelters, setShelters] = useState([]);
    const [viewMode, setViewMode] = useState('map'); // 'map' | 'list' | 'favorites'

    const handleMarkerClick = (shelter) => {
    setActiveShelterId(shelter.id);
    goToShelter(shelter); // Pans map to marker

        // Automatically scroll the horizontal card list to the active card
        const cardElement = document.getElementById(`card-${shelter.id}`);
        if (cardElement) {
            cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    };

    // Ensure map flies to search location if map wasn't ready during initial search
    useEffect(() => {
    if (map && hasSearched) {
            map.flyTo(initialMapCenter, 13);
        }
    }, [map, hasSearched, initialMapCenter]);
  


    const goToShelter = (shelter) => {
        const lat = shelter.lat || (shelter.center && shelter.center.lat);
        const lon = shelter.lon || (shelter.center && shelter.center.lon);
        let centerArr = [lat, lon];
        if (lat && lon) {
            setInitialMapCenter(centerArr);
            setHasSearched(true);
            setViewMode('map');
            // small timeout to ensure the map re-renders if key changes or center updates
            setTimeout(() => {
                if (map) {
                    map.flyTo(centerArr, 13);
                }
            }, 100);
        }
    };

    const handleZoomIn = () => {
        if (map) map.zoomIn();
    };

    const handleZoomOut = () => {
        if (map) map.zoomOut();
    };

    // Search for shelters in the current visible map area
    const searchInArea = () => {
        if (!map) {
            alert("Map is not ready. Please wait a moment and try again.");
            return;
        }

        const center = map.getCenter();
        const lat = center.lat;
        const lon = center.lng;

        if (lat && lon) {
            fetchShelters(lat, lon);
        } else {
            alert("Could not determine map center coordinates.");
        }
    };

    // Phase 1: Nominatim Geocoding with handleSearch function
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const resp = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`, {
                headers: { 'Accept-Language': 'en-US,en;q=0.9' }
            });
            const data = await resp.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const latNum = parseFloat(lat);
                const lonNum = parseFloat(lon);
        
                if (isNaN(latNum) || isNaN(lonNum)) {
                    alert("Could not determine coordinates for this location.");
                    return;
                }

                const centerArr = [latNum, lonNum];
                setInitialMapCenter(centerArr);
        
                if (map) {
                    map.flyTo(centerArr, 13);
                }
        
                // Always fetch shelters, even if map is not mounted yet
                fetchShelters(latNum, lonNum);
                setHasSearched(true);
                if (viewMode === 'favorites') {
                    setViewMode('map');
                }

            } else {
                alert("Location not found!");
            }

        } catch (err) {
            console.error(err);
            alert("Search failed.");
        } finally {
            setIsSearching(false);
        }
    };

    // Phase 2: Overpass QL Shelter Fetching with fetchShelters function
    const fetchShelters = useCallback(async (lat, lon) => {
        if (lat === undefined || lon === undefined) {
            if (map) {
                const center = map.getCenter();
                lat = center.lat;
                lon = center.lng;
            } else {
                return;
            }
        }
        setIsLoadingShelters(true);

        let lastError = null;

        // Small 500ms delay between retries to give the next mirror a clean start
        if (lastError) await new Promise(resolve => setTimeout(resolve, 500));
      
        try {
            const radius = 50000; // 50km
            const overpassQuery = `
                [out:json][timeout:25];
                (
                    nwr["amenity"="animal_shelter"](around:${radius},${lat},${lon});
                    nwr["tourism"="animal_boarding"](around:${radius},${lat},${lon});
                    nwr["tourism"="animal_breeding"](around:${radius},${lat},${lon});
                    nwr["animal_shelter"](around:${radius},${lat},${lon});
                );
                out center tags;
            `;
             // Ensure 'center' is specified here
            // nwr["amenity"="veterinary"](around:${radius},${lat},${lon});

            const response = await fetch("https://overpass-api.de/api/interpreter", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: `data=${encodeURIComponent(overpassQuery)}`
            });
            console.log(response);
            if (!response.ok) {
                throw new Error(`Status ${response.status}`);
            }

            const data = await response.json();
            // Log full response and element count for every request
            console.log(data);
            console.log((data.elements || []).length);
            const elements = data.elements || [];
               
            if (elements.length === 0) {
                console.warn(`No shelters found near ${lat}, ${lon} within 30km`);
            }

            setShelters(elements);
            console.log("Shelters found:", elements.length);
            console.log(elements);

            setIsLoadingShelters(false);
            return; 

        } catch (err) {
            console.warn(`Mirror failed, trying next...:`, err.message);
            lastError = err;
        }
 

        setIsLoadingShelters(false);
        if (lastError) {
           console.log("All Overpass servers are currently struggling due to high traffic. Please try again in about 1 minute.");
        }

    }, [map]); // <-- Add a dependency array

     // Calling location search hook
     // Outside of all callbacks, at the main level of the Map component!
    useLocationSearch(map, setIsLoadingShelters, fetchShelters);

    return (
        <section id="map-search">
            <header id="map-navigation">
                <div>
                    <Link className="home-btn" to="/">
                        <img className="logo-icon" src={logoIcon} alt="Pet Map Logo" />
                    </Link> 
                </div> 
                {/* MAP Search bar */}
                <form id="map-search-bar" className="search-bar-container bg-base" onSubmit={handleSearch}>
                    <input id="location-input" className="search-input"
                        type="text" 
                        placeholder="Search city (e.g. London)" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button id="search-btn" className="search-button" 
                        type="submit" disabled={isSearching}>
                        {isSearching ? '...' : 'Go'}
                    </button>
                </form>

                {/* Search in this area Btn */}
                <div >
                     <button className="round-container bg-cyan-blue"
                        onClick={searchInArea}
                        title="Search in this area"
                    >
                        <p className="libre-franklin-700">Search this area</p>
                    </button>
                </div>

               {/* Favorites buton */}
                <div className="fav-container flex-row">
                    <Link className="nav-sections" to="/favorites" id="favorites" style={{ textDecoration: 'none' }}> 
                        <div id="favorites-btn" >
                            <p id="favorites-count" className="icon-text libre-franklin-700">{favorites.length}</p>
                        </div>
                        <p className="libre-franklin-700">
                            Favorites
                        </p>
                    </Link>
                </div> 
                
                {/* ZOOM Controls */}
                <div className="round-container-vert">
                    <button 
                        id="map-switcher-zoom-plus" 
                        className="round-switch-btn"
                        onClick={handleZoomIn}
                        title="Zoom in"
                    >
                        <p className="jost-700">+</p>
                    </button>
                    <button 
                        id="map-switcher-zoom-minus" 
                        className="round-switch-btn flip-vertical"
                        onClick={handleZoomOut}
                        title="Zoom out"
                    >
                        <p className="jost-700">-</p>
                    </button>
                </div> 
            </header>
            <main id="map-main-content">
                <MapContainer id="leaflet-map" center={initialMapCenter} zoom={13} zoomControl={false} ref={setMap} >
                    <TileLayer
                        url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${import.meta.env.VITE_STADIA_MAPS_KEY || ''}`}
                        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                    /> 

                    {/* Render overpass markers */}
                    {shelters.map(shelter => (
                        <ShelterMarkerCard 
                            key={shelter.id}
                            shelter={shelter} 
                            icon={DefaultIcon}
                            isFavorite={isFavorite} // <--- Pass the function, do not execute it here
                            toggleFavorite={toggleFavorite}
                            onMarkerClick={(selectedShelter) => {
                                handleMarkerClick(shelter);
                                setActiveShelterId(selectedShelter.id);
                                // Automatically scroll the list below to the clicked card
                                const cardElement = document.getElementById(`card-${selectedShelter.id}`);
                                if (cardElement) {
                                    cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                                }
                            }}
                        />
                    ))}
                </MapContainer> 

                {/* Card List positioned over the bottom of the map */}
                <div className="items-grid">
                    {shelters.map(shelter => (
                        <div key={shelter.id} id={`card-${shelter.id}`} className="card-wrapper">
                            <ShelterCard 
                                shelter={shelter}
                                isFavorite={isFavorite(shelter.id)}
                                onToggleFavorite={toggleFavorite}
                                isActive={activeShelterId === shelter.id}
                                onCardClick={(selectedShelter) => {
                                    handleMarkerClick(selectedShelter); // Reuse same logic for card tap!
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Status Message for empty results */}
                {!isLoadingShelters && hasSearched && shelters.length === 0 && (
                    <div className="status-message">
                    No shelters found in this area (30km radius)
                    </div>
                )}

                {/* UI Overlay */}
                <section id="map" style={{ pointerEvents: 'none' }}>
                    <div id="map-control" style={{ pointerEvents: 'auto' }}>
                        <button className="map-btn" onClick={handleZoomIn}>+</button>
                        <button className="map-btn" onClick={handleZoomOut}>-</button>
                        
                        {/* Search in this area button */}
                        <button 
                            className="map-btn search-area-btn"
                            onClick={() => fetchShelters()} 
                            disabled={isLoadingShelters}
                        >
                            {isLoadingShelters ? '...' : 'Search Area'}
                        </button>
                    </div>
                    <div className="items-grid">
                        {shelters.map(shelter => (
                            <div key={shelter.id} id={`card-${shelter.id}`} >
                                <ShelterCard 
                                    shelter={shelter}
                                    isFavorite={isFavorite(shelter.id)}
                                    onToggleFavorite={toggleFavorite}
                                    isActive={activeShelterId === shelter.id}
                                    onAction={goToShelter}
                                    onCardClick={(selectedShelter) => {
                                        setActiveShelterId(selectedShelter.id);
                                        goToShelter(selectedShelter); // Pans the map to the pin
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <div id="map-close" style={{ pointerEvents: 'auto' }}>
                        <button className="map-btn" onClick={() => setHasSearched(false)}>x</button>
                    </div>
                </section>
            </main>
        </section>
    )
}


export default Map;

