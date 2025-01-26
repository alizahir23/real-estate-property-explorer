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

### Unfinished Features

- Sorting property lists alphabetically, chronologically etc
- "All Filters" button is currently non functional since there were'nt many features to filter with
- Navbar elements are non functional

### Challenges and Future Improvements

#### Current Limitation

The geocoding process is currently limited to 50 properties due to Google Maps API response time. The editing screen is also very slugish at this point since its loading over 9,000+ records. 

#### Proposed Solutions

1. **Batch Processing**: Implement pagination or batch geocoding and loading to handle larger property sets
2. **Caching Mechanism**: Store geocoded results to reduce repeated API calls

### Responsive Design

- Mobile-friendly toggle between map and list views
- Adaptive layout for different screen sizes
- Consistent UI/UX across devices
- Responsiveness of loading state of the sidebar can be improved 

## Deployment

Open [https://real-estate-property-explorer-pw2n.vercel.app/](https://real-estate-property-explorer-pw2n.vercel.app/) in your browser.
