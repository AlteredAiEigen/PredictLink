# Grocery Supply Chain Analytics Dashboard

A comprehensive React-based dashboard for AI-powered supply chain management, featuring three main pages:

1. **Main Dashboard** - Overview of the platform with key metrics and features
2. **Client Dashboard** - Detailed view for Singh Union Enterprises with client-specific data
3. **Predictive Page** - Explanation of how the AI-powered system works

## Features

- 🚀 **Modern React Architecture** - Built with React 18 and functional components
- 📊 **Interactive Charts** - Powered by Chart.js and react-chartjs-2
- 🎨 **Beautiful UI** - Modern design with gradients, animations, and responsive layout
- 📱 **Mobile Responsive** - Optimized for all device sizes
- 🔄 **React Router** - Seamless navigation between pages
- 📈 **Real-time Data** - Dynamic data management with React Context
- 🎯 **Interactive Modals** - Detailed views for clients and products

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Dashboard.js     # Main dashboard component
│   ├── Header.js        # Header component
│   ├── StatsCards.js    # Statistics cards
│   ├── ClientChart.js   # Chart component
│   ├── ClientList.js    # Client list component
│   ├── ProductPredictions.js # Product predictions
│   ├── Alerts.js        # Alerts component
│   ├── ClientModal.js   # Client detail modal
│   ├── ProductsModal.js # Products detail modal
│   └── Dashboard.css    # Dashboard styles
├── pages/               # Page components
│   ├── MainDashboard.js    # Main overview page
│   ├── ClientDashboard.js  # Client-specific dashboard
│   ├── PredictivePage.js   # How it works page
│   ├── MainDashboard.css   # Main page styles
│   ├── ClientDashboard.css # Client page styles
│   └── PredictivePage.css  # Predictive page styles
├── context/             # React Context
│   └── DataContext.js   # Data management context
├── data/                # Data files
│   └── data.js          # Mock data for the application
├── App.js               # Main app component
├── App.css              # Global styles
└── index.js             # App entry point
```

## Key Features

### Main Dashboard
- Platform overview with key metrics
- Revenue growth trends
- Product category distribution
- Feature highlights
- System alerts and recommendations

### Client Dashboard
- Client-specific data for Singh Union Enterprises
- Interactive client list with detailed modals
- Product demand predictions
- AI-generated alerts
- Clickable statistics cards

### Predictive Page
- Step-by-step process explanation
- Benefits and results
- Key features overview
- Call-to-action sections

## Data Management

The app uses React Context for state management with mock data stored in `src/data/data.js`. The data includes:

- Company information
- Client data with order predictions
- Product categories and predictions
- System alerts
- Chart data

## Styling

The app uses CSS modules with:
- Modern gradient backgrounds
- Smooth animations and transitions
- Responsive grid layouts
- Interactive hover effects
- Mobile-first design approach

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

The app is built with Create React App and includes:
- Hot reloading for development
- ESLint for code quality
- Automatic browser refresh
- Error reporting

## Production Build

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build` folder.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for demonstration purposes.
