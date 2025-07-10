const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { 
    getRandomUserAgent, 
    getRandomReferrer, 
    isMobileUserAgent 
} = require('./user-agents');

// Add stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

// List of websites to visit - Add your target URLs here
const targetUrls = [
    'https://www.example.com',
    'https://www.google.com',
    'https://www.github.com',
    'https://www.stackoverflow.com',
    'https://www.wikipedia.org',
    'https://www.reddit.com',
    'https://www.youtube.com',
    'https://www.twitter.com',
    'https://www.facebook.com',
    'https://www.linkedin.com'
];

// Configuration settings
const config = {
    minPageTime: 20000, // Minimum time to spend on page (20 seconds)
    maxPageTime: 40000, // Maximum time to spend on page (40 seconds)
    minWaitBetweenVisits: 30000, // Minimum wait between visits (30 seconds)
    maxWaitBetweenVisits: 60000, // Maximum wait between visits (60 seconds)
    scrollCount: 3, // Number of scroll actions per page
    scrollDelay: 2000, // Delay between scroll actions (2 seconds)
    pageTimeout: 30000, // Page load timeout (30 seconds)
    headless: true // Set to false for debugging
};

/**
 * Generate random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Log formatted message with timestamp
 * @param {string} message - Message to log
 * @param {string} type - Log type (INFO, SUCCESS, ERROR, WARNING)
 */
function log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const colors = {
        INFO: '\x1b[36m',    // Cyan
        SUCCESS: '\x1b[32m', // Green
        ERROR: '\x1b[31m',   // Red
        WARNING: '\x1b[33m'  // Yellow
    };
    const reset = '\x1b[0m';
    console.log(`${colors[type]}[${timestamp}] ${type}: ${message}${reset}`);
}

/**
 * Simulate realistic scrolling behavior
 * @param {object} page - Puppeteer page object
 */
async function simulateScrolling(page) {
    try {
        log('Starting scrolling simulation...');
        
        // Get page dimensions
        const dimensions = await page.evaluate(() => {
            return {
                width: document.documentElement.scrollWidth,
                height: document.documentElement.scrollHeight,
                viewportHeight: window.innerHeight
            };
        });
        
        const scrollSteps = Math.min(config.scrollCount, Math.floor(dimensions.height / dimensions.viewportHeight));
        
        for (let i = 0; i < scrollSteps; i++) {
            // Random scroll position
            const scrollY = Math.floor((dimensions.height / scrollSteps) * (i + 1));
            
            await page.evaluate((y) => {
                window.scrollTo({ top: y, behavior: 'smooth' });
            }, scrollY);
            
            log(`Scrolled to position: ${scrollY}px`);
            
            // Wait between scrolls
            await page.waitForTimeout(getRandomDelay(1000, config.scrollDelay));
        }
        
        // Scroll back to top occasionally
        if (Math.random() < 0.3) {
            await page.evaluate(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            log('Scrolled back to top');
        }
        
    } catch (error) {
        log(`Error during scrolling: ${error.message}`, 'ERROR');
    }
}

/**
 * Visit a single URL with realistic behavior
 * @param {object} browser - Puppeteer browser instance
 * @param {string} url - URL to visit
 */
async function visitUrl(browser, url) {
    const page = await browser.newPage();
    
    try {
        // Get random user agent and referrer
        const userAgent = getRandomUserAgent();
        const referrer = getRandomReferrer();
        const isMobile = isMobileUserAgent(userAgent);
        
        log(`Visiting: ${url}`);
        log(`User-Agent: ${userAgent}`);
        log(`Referrer: ${referrer || 'Direct (no referrer)'}`);
        log(`Device Type: ${isMobile ? 'Mobile' : 'Desktop'}`);
        
        // Set user agent
        await page.setUserAgent(userAgent);
        
        // Set viewport based on device type
        if (isMobile) {
            await page.setViewport({
                width: 375,
                height: 667,
                isMobile: true,
                hasTouch: true
            });
        } else {
            await page.setViewport({
                width: 1920,
                height: 1080,
                isMobile: false,
                hasTouch: false
            });
        }
        
        // Set extra headers
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            ...(referrer && { 'Referer': referrer })
        });
        
        const startTime = Date.now();
        
        // Navigate to URL
        await page.goto(url, { 
            waitUntil: 'networkidle2',
            timeout: config.pageTimeout
        });
        
        log(`Successfully loaded: ${url}`, 'SUCCESS');
        
        // Wait a bit before starting interactions
        await page.waitForTimeout(getRandomDelay(2000, 5000));
        
        // Simulate scrolling behavior
        await simulateScrolling(page);
        
        // Calculate remaining time to spend on page
        const timeSpent = Date.now() - startTime;
        const remainingTime = getRandomDelay(config.minPageTime, config.maxPageTime) - timeSpent;
        
        if (remainingTime > 0) {
            log(`Staying on page for additional ${Math.round(remainingTime / 1000)} seconds...`);
            await page.waitForTimeout(remainingTime);
        }
        
        const totalTimeSpent = Date.now() - startTime;
        log(`Total time spent on ${url}: ${Math.round(totalTimeSpent / 1000)} seconds`, 'SUCCESS');
        
    } catch (error) {
        log(`Error visiting ${url}: ${error.message}`, 'ERROR');
    } finally {
        await page.close();
    }
}

/**
 * Main traffic bot function
 */
async function startTrafficBot() {
    log('Starting Traffic Bot...', 'SUCCESS');
    log(`Target URLs: ${targetUrls.length}`, 'INFO');
    log(`Page time: ${config.minPageTime/1000}-${config.maxPageTime/1000} seconds`, 'INFO');
    log(`Wait between visits: ${config.minWaitBetweenVisits/1000}-${config.maxWaitBetweenVisits/1000} seconds`, 'INFO');
    
    let browser;
    
    // Try multiple browser launch configurations
    const launchConfigs = [
        {
            name: 'Default Configuration',
            config: {
                headless: config.headless,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--single-process',
                    '--no-zygote'
                ]
            }
        },
        {
            name: 'Stealth Configuration',
            config: {
                headless: config.headless,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding',
                    '--disable-features=TranslateUI',
                    '--disable-extensions',
                    '--disable-default-apps',
                    '--disable-sync',
                    '--disable-translate',
                    '--hide-scrollbars',
                    '--mute-audio',
                    '--no-default-browser-check',
                    '--no-pings',
                    '--password-store=basic',
                    '--use-mock-keychain',
                    '--disable-blink-features=AutomationControlled',
                    '--disable-web-security',
                    '--disable-features=site-per-process',
                    '--disable-features=VizDisplayCompositor',
                    '--disable-hang-monitor',
                    '--disable-popup-blocking',
                    '--disable-prompt-on-repost'
                ],
                ignoreHTTPSErrors: true,
                ignoreDefaultArgs: ['--enable-automation'],
                defaultViewport: null
            }
        },
        {
            name: 'Minimal Configuration',
            config: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        }
    ];
    
    for (const {name, config: launchConfig} of launchConfigs) {
        try {
            log(`Trying ${name}...`, 'INFO');
            browser = await puppeteer.launch(launchConfig);
            log(`Successfully launched browser with ${name}!`, 'SUCCESS');
            break;
        } catch (error) {
            log(`Failed to launch with ${name}: ${error.message}`, 'WARNING');
        }
    }
    
    if (!browser) {
        throw new Error('Failed to launch browser with any configuration');
    }
    
    log('Browser launched successfully', 'SUCCESS');
    
    let visitCount = 0;
    
    // Infinite loop for continuous traffic generation
    while (true) {
        try {
            // Select random URL from the list
            const randomUrl = targetUrls[Math.floor(Math.random() * targetUrls.length)];
            
            visitCount++;
            log(`\n=== Visit #${visitCount} ===`, 'INFO');
            
            // Visit the selected URL
            await visitUrl(browser, randomUrl);
            
            // Wait before next visit
            const waitTime = getRandomDelay(config.minWaitBetweenVisits, config.maxWaitBetweenVisits);
            log(`Waiting ${Math.round(waitTime / 1000)} seconds before next visit...`, 'INFO');
            await new Promise(resolve => setTimeout(resolve, waitTime));
            
        } catch (error) {
            log(`Critical error in main loop: ${error.message}`, 'ERROR');
            log('Continuing with next iteration...', 'WARNING');
            
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
}

/**
 * Handle graceful shutdown
 */
process.on('SIGINT', () => {
    log('Received SIGINT. Shutting down gracefully...', 'WARNING');
    process.exit(0);
});

process.on('SIGTERM', () => {
    log('Received SIGTERM. Shutting down gracefully...', 'WARNING');
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`, 'ERROR');
    log('Stack trace:', 'ERROR');
    console.error(error.stack);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection at: ${promise}`, 'ERROR');
    log(`Reason: ${reason}`, 'ERROR');
});

// Start the bot
if (require.main === module) {
    startTrafficBot().catch(error => {
        log(`Failed to start traffic bot: ${error.message}`, 'ERROR');
        process.exit(1);
    });
}

module.exports = {
    startTrafficBot,
    visitUrl,
    simulateScrolling,
    config
};
