# CryptoWeather Nexus

## Overview

CryptoWeather Nexus is a modern, multi-page dashboard that provides real-time cryptocurrency prices, weather updates, and news headlines. The application integrates WebSockets for live data updates and allows users to manage preferences for favorite cryptocurrencies and cities.

## Live Demo

[CryptoWeather Nexus](https://crypto-weather-nexus-aayhkeiju-nikhils-projects-d2744fdf.vercel.app/)

## Features

- **Real-time Cryptocurrency Prices**: Live updates for Bitcoin, Ethereum, and one additional cryptocurrency.
- **Weather Information**: Weather details for predefined cities with historical data visualization.
- **News Section**: Latest cryptocurrency-related news headlines.
- **WebSockets Integration**: Real-time price updates for cryptocurrencies.
- **User Preferences**: Favorite cryptocurrencies and cities are stored locally.
- **Notifications**: Alerts for significant price changes and weather conditions.
- **Multi-Page Architecture**: Dedicated pages for detailed weather and crypto insights.
- **Responsive UI**: Tailwind CSS ensures adaptability across devices.

## Tech Stack

- **Frontend**: Next.js (App Router), React (Hooks)

- **State Management**: Redux (Redux Thunk for async operations)

- **Styling**: Tailwind CSS

- **APIs Used**:

  - OpenWeatherMap (Weather Data)
  - WeatherAPI (Historical Data)
  - CoinGecko REST API (Initial, Historical Crypto Data)
  - CoinCap WebSocket API (Crypto Prices)
  - NewsData.io (Crypto News)

- **Notifications**: Custom toast notifications for alerts

## Installation

### Prerequisites

Ensure you have **Node.js** and **npm/yarn** installed.

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/Nikhil-0010/CryptoWeather-Nexus.git
   ```
2. Navigate to the project directory:
   ```sh
   cd CryptoWeather-Nexus
   ```
3. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
4. Set up environment variables:
   - Create a `.env.local` file in the root directory.
   - Add the following environment variables:
     ```sh
     NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key
     NEXT_PUBLIC_CRYPTO_API_KEY=your_crypto_api_key
     NEXT_PUBLIC_NEWS_API_KEY=your_newsdata_api_key
     ```
5. Start the development server:
   ```sh
   npm run dev  # or yarn dev
   ```
6. Open the application in the browser:
   ```sh
   http://localhost:3000
   ```

## Deployment

The project is deployed on **Vercel**. To deploy your own version:

```sh
vercel deploy
```

Ensure environment variables are correctly set in Vercel's project settings.

## Folder Structure

```
CryptoWeather-Nexus/
├── app/
│   ├── crypto/        # Cryptocurrency details page
│   ├── weather/       # Weather details page
│   ├── news/          # News section
│   ├── components/    # Reusable UI components
├── redux/             # Redux store, actions, reducers
├── hooks/             # Custom hooks (e.g., WebSocket handlers)
├── styles/            # Tailwind CSS configuration
├── public/            # Static assets
├── .env.local         # Environment variables (not included in repo)
├── package.json       # Project dependencies
└── README.md          # Project documentation
```

## Design Decisions

1. **App Router over Page Router**: Enables better scalability and optimized rendering.
2. **Redux for State Management**: Ensures a centralized data flow, especially for real-time updates.
3. **WebSockets for Real-Time Data**: Enhances user experience with instant crypto price updates.
4. **Tailwind CSS for Styling**: Provides a sleek, responsive UI with minimal effort.
5. **Local Storage for User Preferences**: Allows users to save favorite cities and cryptos.

## Challenges & Solutions

- **API Rate Limits**: Implemented caching and fallback mechanisms for seamless UX.

- **WebSocket Reconnection**: Implemented automatic reconnection logic to handle various scenarios such as network interruptions, server downtime, and unexpected disconnections. The system attempts to re-establish connections with exponential backoff and user notifications to ensure seamless real-time updates.

- **Mobile Responsiveness**: Used Tailwind CSS breakpoints for an adaptive layout.

- **Handling API Response Inconsistencies**: Implemented error handling and validation logic to manage missing or inconsistent data from third-party APIs, ensuring smooth user experience.

- **Performance Optimization**: Used memoization and optimized API calls to improve the efficiency of real-time updates and reduce unnecessary re-renders.

- **State Complexity Management**: Leveraged Redux Toolkit to maintain a scalable and maintainable state management structure.

- **Mobile Responsiveness**: Used Tailwind CSS breakpoints for an adaptive layout.

## Future Enhancements

- User authentication for personalized settings.
- More customization options for dashboard layout.
- Dark mode support.

## Contributing

Contributions are welcome! Feel free to fork the repository, create a new branch, and submit a pull request.

## Contact

For queries or feedback, reach out to me:

- **GitHub**: [Nikhil-0010](https://github.com/Nikhil-0010)
- **Email**: ynikhil645@gmail.com

---