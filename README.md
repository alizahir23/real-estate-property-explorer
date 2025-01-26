# Real Estate Property Explorer

## Project Overview

This is a web application for exploring real estate properties, featuring an interactive map and list view.

## Key Features

- Interactive property search across multiple dimensions (city, community, subcommunity)
- Dual view mode: Map and List view of properties
- Responsive design for desktop and mobile
- Property management modal for adding/editing/deleting properties
- Recent search tracking
- Geocoding integration for mapping properties

## Tech Stack

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Google Maps API
- FontAwesome Icons

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Google Maps API Key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/alizahir23/real-estate-property-explorer.git
cd real-estate-property-explorer
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root and add:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Design Choices and Considerations

### Search and Filtering

- Implemented a flexible search mechanism that supports multiple input formats
- Geocoding integration to map properties dynamically
- Limited to 50 search results due to API response time constraints

### Performance Optimization

- Used `useMemo` for filtering properties
- Implemented loading states for better user experience
- Marker clustering for map view to handle multiple properties

### Challenges and Future Improvements

#### Current Limitation

The geocoding process is currently limited to 50 properties due to Google Maps API response time. This can result in some properties remaining unmapped.

#### Proposed Solutions

1. **Batch Processing**: Implement pagination or batch geocoding to handle larger property sets
2. **Caching Mechanism**: Store geocoded results to reduce repeated API calls

### Responsive Design

- Mobile-friendly toggle between map and list views
- Adaptive layout for different screen sizes
- Consistent UI/UX across devices

## Deployment

Open [https://real-estate-property-explorer-pw2n.vercel.app/](https://real-estate-property-explorer-pw2n.vercel.app/) in your browser.
