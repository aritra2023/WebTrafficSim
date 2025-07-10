const https = require('https');
const http = require('http');
const { URL } = require('url');
const { 
    getRandomUserAgent, 
    getRandomReferrer, 
    isMobileUserAgent 
} = require('./user-agents');

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
    requestTimeout: 30000, // Request timeout (30 seconds)
    followRedirects: true,
    maxRedirects: 5
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
 * Make HTTP request with realistic headers
 * @param {string} url - URL to request
 * @param {string} userAgent - User agent string
 * @param {string} referrer - Referrer URL
 * @returns {Promise<Object>} Response object
 */
function makeRequest(url, userAgent, referrer) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const client = isHttps ? https : http;
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: {
                'User-Agent': userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Cache-Control': 'max-age=0',
                'DNT': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                ...(referrer && { 'Referer': referrer })
            },
            timeout: config.requestTimeout
        };

        const req = client.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    data: data,
                    size: data.length
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

/**
 * Simulate realistic page interaction
 * @param {string} url - URL being visited
 * @param {Object} response - HTTP response object
 * @param {string} userAgent - User agent used
 */
async function simulatePageInteraction(url, response, userAgent) {
    const isMobile = isMobileUserAgent(userAgent);
    const pageSize = response.size;
    
    log(`Page loaded successfully (${pageSize} bytes)`, 'SUCCESS');
    log(`Device Type: ${isMobile ? 'Mobile' : 'Desktop'}`);
    
    // Simulate reading time based on page size
    const baseReadingTime = Math.min(pageSize / 100, 10000); // 100 bytes per 10ms, max 10 seconds
    const readingTime = getRandomDelay(baseReadingTime, baseReadingTime * 2);
    
    log(`Simulating reading for ${Math.round(readingTime / 1000)} seconds...`);
    await new Promise(resolve => setTimeout(resolve, readingTime));
    
    // Simulate scroll actions
    const scrollCount = getRandomDelay(2, 5);
    for (let i = 0; i < scrollCount; i++) {
        const scrollDelay = getRandomDelay(1000, 3000);
        log(`Simulating scroll action ${i + 1}/${scrollCount}`);
        await new Promise(resolve => setTimeout(resolve, scrollDelay));
    }
    
    // Additional interaction time
    const additionalTime = getRandomDelay(5000, 15000);
    log(`Additional interaction time: ${Math.round(additionalTime / 1000)} seconds`);
    await new Promise(resolve => setTimeout(resolve, additionalTime));
}

/**
 * Visit a single URL with realistic behavior
 * @param {string} url - URL to visit
 */
async function visitUrl(url) {
    try {
        // Get random user agent and referrer
        const userAgent = getRandomUserAgent();
        const referrer = getRandomReferrer();
        
        log(`Visiting: ${url}`);
        log(`User-Agent: ${userAgent}`);
        log(`Referrer: ${referrer || 'Direct (no referrer)'}`);
        
        const startTime = Date.now();
        
        // Make HTTP request
        const response = await makeRequest(url, userAgent, referrer);
        
        if (response.statusCode >= 200 && response.statusCode < 300) {
            log(`Successfully connected to ${url} (Status: ${response.statusCode})`, 'SUCCESS');
            
            // Simulate page interaction
            await simulatePageInteraction(url, response, userAgent);
            
            // Calculate remaining time to spend on page
            const timeSpent = Date.now() - startTime;
            const remainingTime = getRandomDelay(config.minPageTime, config.maxPageTime) - timeSpent;
            
            if (remainingTime > 0) {
                log(`Staying on page for additional ${Math.round(remainingTime / 1000)} seconds...`);
                await new Promise(resolve => setTimeout(resolve, remainingTime));
            }
            
            const totalTimeSpent = Date.now() - startTime;
            log(`Total time spent on ${url}: ${Math.round(totalTimeSpent / 1000)} seconds`, 'SUCCESS');
            
        } else if (response.statusCode >= 300 && response.statusCode < 400) {
            log(`Received redirect from ${url} (Status: ${response.statusCode})`, 'WARNING');
            
            // Handle redirect
            const location = response.headers.location;
            if (location) {
                log(`Following redirect to: ${location}`, 'INFO');
                // Could implement redirect following here
            }
        } else {
            log(`Received error response from ${url} (Status: ${response.statusCode})`, 'ERROR');
        }
        
    } catch (error) {
        log(`Error visiting ${url}: ${error.message}`, 'ERROR');
    }
}

/**
 * Main traffic bot function
 */
async function startTrafficBot() {
    log('Starting HTTP Traffic Bot...', 'SUCCESS');
    log(`Target URLs: ${targetUrls.length}`, 'INFO');
    log(`Page time: ${config.minPageTime/1000}-${config.maxPageTime/1000} seconds`, 'INFO');
    log(`Wait between visits: ${config.minWaitBetweenVisits/1000}-${config.maxWaitBetweenVisits/1000} seconds`, 'INFO');
    log('Using HTTP requests to simulate traffic (no browser dependencies)', 'INFO');
    
    let visitCount = 0;
    
    // Infinite loop for continuous traffic generation
    while (true) {
        try {
            // Select random URL from the list
            const randomUrl = targetUrls[Math.floor(Math.random() * targetUrls.length)];
            
            visitCount++;
            log(`\n=== Visit #${visitCount} ===`, 'INFO');
            
            // Visit the selected URL
            await visitUrl(randomUrl);
            
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
    config
};