# Node.js Traffic Bot with Puppeteer

A sophisticated traffic bot built with Node.js and Puppeteer that simulates realistic website traffic with stealth capabilities to avoid detection.

## Features

- **Stealth Mode**: Uses puppeteer-extra-plugin-stealth to avoid bot detection
- **User Agent Rotation**: Randomly switches between desktop and mobile user agents
- **Referrer Simulation**: Simulates traffic from Google, Facebook, Twitter, and other popular sites
- **Realistic Behavior**: Includes scrolling, random wait times, and natural browsing patterns
- **Comprehensive Logging**: Detailed console output with timestamps and color coding
- **Error Handling**: Robust error handling with graceful recovery
- **Infinite Loop**: Continuous operation with configurable delays
- **Mobile & Desktop**: Supports both mobile and desktop viewport simulation

## Installation

### For Replit Environment

1. **Install Dependencies**:
   ```bash
   npm install puppeteer-extra puppeteer-extra-plugin-stealth puppeteer
   ```

2. **Run the Bot**:
   
   **Option A: Full Browser Simulation (Recommended)**
   ```bash
   node index.js
   ```
   
   **Option B: HTTP-based Simulation (Fallback)**
   ```bash
   node http-traffic-bot.js
   ```
   
   > **Note**: If you encounter browser dependency issues in the Replit environment, use the HTTP-based version which provides similar functionality without requiring system browser dependencies.

## Available Versions

### 1. Full Browser Version (`index.js`)
- Uses Puppeteer with full browser simulation
- Supports JavaScript execution and DOM interaction
- Better stealth capabilities
- Requires system browser dependencies

### 2. HTTP-based Version (`http-traffic-bot.js`)
- Uses native HTTP requests
- No browser dependencies required
- Simulates realistic user behavior
- Works in constrained environments like Replit

Both versions provide:
- User-Agent rotation (mobile/desktop)
- Referrer simulation
- Realistic timing and behavior patterns
- Comprehensive logging
- Infinite loop operation

## Configuration

### Target URLs
Edit the `targetUrls` array in either file to specify which websites to visit:

```javascript
const targetUrls = [
    'https://www.example.com',
    'https://www.google.com',
    'https://www.github.com',
    // Add your target URLs here
];
```

### Timing Configuration
Adjust the timing settings in the `config` object:

```javascript
const config = {
    minPageTime: 20000, // Minimum time to spend on page (20 seconds)
    maxPageTime: 40000, // Maximum time to spend on page (40 seconds)
    minWaitBetweenVisits: 30000, // Minimum wait between visits (30 seconds)
    maxWaitBetweenVisits: 60000, // Maximum wait between visits (60 seconds)
    headless: true // Set to false for debugging (browser version only)
};
```

## File Structure

- `index.js` - Main traffic bot with full browser simulation
- `http-traffic-bot.js` - HTTP-based traffic simulation (fallback)
- `user-agents.js` - User agent and referrer management
- `README.md` - This documentation

## How It Works

1. **Initialization**: Loads configuration and sets up stealth plugins
2. **Target Selection**: Randomly selects from the predefined URL list
3. **User Agent Setup**: Randomly assigns desktop or mobile user agent
4. **Request/Navigation**: Makes HTTP request or navigates to target with simulated referrer
5. **Behavior Simulation**: Performs scrolling, waiting, and interaction patterns
6. **Cleanup**: Closes connections and waits before next iteration
7. **Loop**: Repeats process indefinitely with randomized delays

## Stealth Features

- Random user agent rotation (70% desktop, 30% mobile)
- Realistic referrer URLs from popular sites
- Random timing between 20-40 seconds per page
- Simulated scrolling and reading behavior
- Proper HTTP headers to mimic real browsers
- Error handling and graceful recovery

## Troubleshooting

### Browser Dependencies (Puppeteer version)
If you encounter errors like "libglib-2.0.so.0: cannot open shared object file":
1. Use the HTTP-based version instead: `node http-traffic-bot.js`
2. Or install system dependencies (advanced users only)

### Network Issues
- Check internet connectivity
- Verify target URLs are accessible
- Monitor console output for detailed error messages

## Usage Examples

### Basic Usage
```bash
# Start the full browser version
node index.js

# Or start the HTTP-based version
node http-traffic-bot.js
```

### Background Operation
```bash
# Run in background (Linux/Mac)
nohup node http-traffic-bot.js > traffic.log 2>&1 &

# Monitor logs
tail -f traffic.log
```

## Security and Ethics

This tool is designed for:
- Testing your own websites
- Load testing with permission
- Educational purposes

**Important**: Always ensure you have permission to access the websites you're testing. Respect robots.txt files and terms of service.

## License

This project is for educational and testing purposes only. Use responsibly and in compliance with all applicable laws and terms of service.