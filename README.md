# Animal Shelter Map SPA

### 🌍 Data & Smart Logic
The app uses a **multi-layered API strategy** to provide global coverage:
1. **Nominatim (OSM)**: Instantly geocodes your city searches into coordinates.
2. **Overpass QL**: A custom query language that finds real animal shelters
(`amenity=animal_shelter`) directly from OpenStreetMap data.

# 1: Title & Introduction
Project: Bilingual Animal Shelter & Pet Adoption Locator
Goal: A fast, interactive web application that helps users locate animal shelters and adoptable pets (dogs and cats) within a specific geographic radius, featuring seamless English/Spanish localization.

# 2: Core Architecture & Data Flow
How the Global Search Engine Works:
Our application relies on a chain of asynchronous API events triggered by user input:

Geocoding: The user enters a city name (e.g., "Málaga"). The app calls the Nominatim API to fetch the exact Latitude and Longitude.

Map Update: The UI auto-pans to the new coordinates using Leaflet.

Concurrent Data Fetching: The app triggers two parallel API searches:

Overpass API: Scans a 20km radius for registered animal shelters via OpenStreetMap.

RescueGroups API: Searches the location for specific pets currently up for adoption.

# 3: The Tech Stack
We chose a modern, hybrid stack balancing a highly interactive frontend with secure backend services:

Frontend: React, JavaScript, HTML, CSS.

UI/UX & Animation: Figma (Design System), CSS animations.

Mapping & Visualization: Leaflet (Maps API) with custom markers.

Backend & State: PHP (for Authentication, Database, and Storage), LocalStorage (for user-level data/timers).

Security & Infrastructure: Vercel Serverless Functions. We deploy on Vercel and use their serverless architecture to securely proxy API requests, keeping our Client Secrets (like the RescueGroups API key) hidden from the client-side.

# 4: Project Structure
Our codebase is modular and feature-based to ensure scalability and clean separation of concerns:

📁 /src

📁 /components - Reusable UI elements (e.g., SearchSidebar, DetailsDrawer).

📁 /features/map - All Leaflet-related map logic, rendering, and custom markers.

📁 /services - API connectors handling the logic for Nominatim, Overpass, and Rescue Groups.

📁 /locales - JSON files handling English and Spanish translations.

📁 /api (Standard Vercel Directory) - Our secure serverless API proxies.