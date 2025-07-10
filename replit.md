# Node.js Traffic Bot with Puppeteer

## Overview

This is a sophisticated traffic bot built with Node.js and Puppeteer designed to simulate realistic website traffic. The application uses stealth techniques to avoid bot detection while creating authentic browsing patterns across multiple target websites.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

✅ **July 10, 2025**: Successfully implemented a fully functional Node.js traffic bot with two versions:
- **Full Browser Version** (`index.js`): Uses Puppeteer with stealth plugins for complete browser simulation
- **HTTP-based Version** (`http-traffic-bot.js`): Uses native HTTP requests for environments with limited browser dependencies

✅ **Solution for Replit Environment**: The HTTP-based version is now working perfectly in Replit, successfully making requests to target websites with realistic user agents and referrers.

✅ **Complete UI/UX Redesign** (**July 10, 2025**): Completely redesigned the interface as "TurboHits":
- **Modern Design**: Dark theme with professional blue color scheme (#3b82f6)
- **No Emojis**: Replaced all emojis with modern Font Awesome icons
- **TurboHits Branding**: Created custom logo with "TH" icon and professional typography
- **Responsive Navigation**: Added sticky navbar with proper navigation between dashboards
- **Dashboard** (Port 5000): Comprehensive analytics with real-time data, charts, and detailed tables
- **Analytics** (Port 3000): Simplified overview with key metrics and status information

✅ **Current Status**: All traffic bots running with modern TurboHits dashboard interface.

✅ **Latest Update** (**July 10, 2025**): Successfully redesigned with dark theme and hamburger navigation:
- **Dark Theme**: Changed background from light gradient to dark navy theme
- **New Logo**: Created "TH" logo with cyan-blue gradient and better colors  
- **Hamburger Menu**: Added responsive 3-bar navigation menu for mobile
- **Extended Navigation**: Added Website, Premium, and Support sections
- **Responsive Design**: Full mobile responsive layout with proper navigation

## System Architecture

### Core Technology Stack
- **Runtime**: Node.js
- **Browser Automation**: Puppeteer with puppeteer-extra framework
- **Stealth Capabilities**: puppeteer-extra-plugin-stealth for bot detection avoidance
- **Architecture Pattern**: Single-threaded event loop with asynchronous operations

### Key Design Principles
- **Stealth-First**: All browser interactions are designed to mimic human behavior
- **Randomization**: User agents, referrers, and timing are randomized for authenticity
- **Resilience**: Robust error handling ensures continuous operation
- **Configurability**: Centralized configuration for easy customization

## Key Components

### 1. Main Application (`index.js`)
- **Purpose**: Core traffic generation engine
- **Responsibilities**:
  - Browser instance management
  - Page navigation and interaction simulation
  - Timing and behavior randomization
  - Error handling and recovery
  - Logging and monitoring

### 2. User Agent Management (`user-agents.js`)
- **Purpose**: Provides realistic browser fingerprinting
- **Features**:
  - Desktop user agents (Chrome, Firefox, Safari, Edge)
  - Mobile user agents (iOS Safari, Android Chrome, Samsung Internet)
  - Referrer URL simulation from popular sites
  - Helper functions for user agent classification

### 3. Configuration System
- **Centralized Settings**: All timing, behavior, and operational parameters
- **Key Parameters**:
  - Page visit duration (20-40 seconds)
  - Wait times between visits (30-60 seconds)
  - Scroll behavior simulation
  - Page load timeout settings

## Data Flow

1. **Initialization**: Load configuration and stealth plugins
2. **Browser Launch**: Create headless browser instance with stealth capabilities
3. **Target Selection**: Randomly select from predefined URL list
4. **User Agent Setup**: Randomly assign desktop or mobile user agent
5. **Page Navigation**: Navigate to target with simulated referrer
6. **Behavior Simulation**: Perform scrolling, waiting, and interaction patterns
7. **Cleanup**: Close page and wait before next iteration
8. **Loop**: Repeat process indefinitely with randomized delays

## External Dependencies

### Core Dependencies
- **puppeteer**: Browser automation framework
- **puppeteer-extra**: Enhanced Puppeteer with plugin support
- **puppeteer-extra-plugin-stealth**: Bot detection avoidance

### Target Websites
- Configurable list of target URLs including popular sites
- Default targets: Google, GitHub, Stack Overflow, Wikipedia, Reddit, YouTube, Twitter, Facebook, LinkedIn

## Deployment Strategy

### Replit Environment
- **Entry Point**: `node index.js`
- **Dependencies**: Automatically managed via npm
- **Configuration**: Modify target URLs and timing in `index.js`
- **Monitoring**: Real-time console logging with timestamps

### Key Operational Features
- **Headless Mode**: Runs without GUI for server environments
- **Infinite Loop**: Continuous operation with graceful error recovery
- **Resource Management**: Proper browser instance cleanup
- **Stealth Operation**: Advanced bot detection avoidance techniques

### Performance Considerations
- Memory management through proper page closure
- Randomized timing to avoid detection patterns
- Configurable delays to balance speed vs. stealth
- Error handling to prevent application crashes

### Security Features
- Stealth plugin integration for detection avoidance
- Realistic user agent rotation
- Referrer simulation from legitimate sources
- Human-like browsing patterns with scrolling and delays