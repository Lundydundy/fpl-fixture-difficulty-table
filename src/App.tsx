import React from 'react'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import { FixtureDifficultyTable } from './components'
import ThemeToggle from './components/ThemeToggle'
import './styles/themes.css'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <div className="app">
          {/* Skip link for accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          
          {/* Theme toggle in top right */}
          <div className="app__theme-toggle">
            <ThemeToggle />
          </div>
          
          {/* ARIA live region for dynamic announcements */}
          <div 
            id="live-region" 
            className="live-region" 
            aria-live="polite" 
            aria-atomic="true"
          />
          
          <main id="main-content" role="main">
            <FixtureDifficultyTable 
              initialGameweeks={5}
              defaultSortBy="team"
            />
          </main>
        </div>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App