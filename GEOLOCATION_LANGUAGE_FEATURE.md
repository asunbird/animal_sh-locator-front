# Geolocation-Based Language Detection

## Overview
This feature automatically sets the user's language based on their geographic location when they first visit the site.

## How It Works

1. **Geolocation Detection**: On first visit, the app fetches the user's country using the free geojs.io API
2. **Language Selection**:
   - Spanish (es) for Spain and Latin American countries
   - English (en) for all other countries
3. **Caching**: The result is cached for 7 days to avoid repeated API calls
4. **Fallback**: If geolocation fails, the app falls back to browser language detection and then to Spanish

## Implementation Details

### Files Added/Modified

1. **src/services/geolocationService.js** (NEW)
   - `getLanguageFromLocation()`: Async function that detects language from user location
   - `clearGeolocationCache()`: Utility to clear cached language preference
   - Supports 19 Spanish-speaking countries

2. **src/i18n.js** (MODIFIED)
   - Added custom geolocation detector as the first detector in the chain
   - Maintains compatibility with existing i18next-browser-languagedetector

### Spanish-Speaking Countries Supported
Spain + 18 Latin American countries:
- Mexico, Guatemala, El Salvador, Honduras, Nicaragua, Costa Rica, Panama
- Cuba, Dominican Republic
- Colombia, Venezuela, Ecuador, Peru, Bolivia
- Paraguay, Argentina, Chile, Uruguay

### Cache Behavior
- Geolocation result is stored in localStorage with key: `petmap_geolocation_language`
- Cache expires after 7 days
- Users can clear cache using `clearGeolocationCache()` from the geolocationService

## Testing

To test the feature:
1. Run `npm run dev` to start the development server
2. On first visit, check the browser's Network tab to see the geojs.io API call
3. Check localStorage to verify the cached language preference
4. Reload the page to confirm language persists from cache

## Privacy & Performance
- Uses a lightweight geolocation API (geojs.io) with no tracking
- Caches result to minimize API calls
- Falls back gracefully if API is unavailable
- No user consent required (only IP-based country detection)

## Future Improvements
- Allow users to manually override the auto-detected language
- Add support for more languages
- Consider using navigator.language as an additional detector
