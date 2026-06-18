# Animal Shelter Map SPA

### 🌍 Data & Smart Logic
The app uses a **multi-layered API strategy** to provide global coverage:
1. **Nominatim (OSM)**: Instantly geocodes your city searches into coordinates.
2. **Overpass QL**: A custom query language that finds real animal shelters
(`amenity=animal_shelter`) directly from OpenStreetMap data.
