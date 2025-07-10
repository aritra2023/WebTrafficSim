const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

// Store traffic data
let trafficData = {
    totalVisits: 0,
    successfulVisits: 0,
    failedVisits: 0,
    visitsByHour: {},
    userAgents: {},
    referrers: {},
    urls: {},
    errors: [],
    lastUpdated: new Date()
};

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Dashboard route
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TurboHits - Traffic Analytics Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .navbar {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            padding: 0 2rem;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
        }
        
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 80px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .logo-svg {
            width: 48px;
            height: 48px;
        }
        
        .logo-text {
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.5px;
        }
        
        .nav-menu {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-item {
            color: #64748b;
            text-decoration: none;
            font-weight: 500;
            padding: 8px 16px;
            border-radius: 8px;
            transition: all 0.2s;
        }
        
        .nav-item:hover {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
        }
        
        .nav-item.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .hero-section {
            text-align: center;
            margin-bottom: 3rem;
            padding: 3rem 0;
        }
        
        .hero-title {
            font-size: 3.5rem;
            font-weight: 700;
            color: white;
            margin-bottom: 1rem;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            line-height: 1.1;
        }
        
        .hero-subtitle {
            font-size: 1.25rem;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 2rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
            padding: 12px 24px;
            border-radius: 50px;
            font-weight: 600;
            border: 2px solid rgba(34, 197, 94, 0.3);
            backdrop-filter: blur(10px);
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .stat-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .stat-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
        }
        
        .stat-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .stat-value {
            font-size: 2.75rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 0.5rem;
            line-height: 1;
        }
        
        .stat-label {
            color: #64748b;
            font-size: 1rem;
            font-weight: 500;
        }
        
        .content-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .section-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
        }
        
        .data-table th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .data-table td {
            padding: 1rem;
            border-bottom: 1px solid #e2e8f0;
            color: #475569;
            background: white;
        }
        
        .data-table tr:hover td {
            background: #f8fafc;
        }
        
        .data-table tr:last-child td {
            border-bottom: none;
        }
        
        .status-indicator {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 50px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .status-active {
            background: rgba(34, 197, 94, 0.1);
            color: #059669;
            border: 1px solid rgba(34, 197, 94, 0.2);
        }
        
        .status-inactive {
            background: rgba(239, 68, 68, 0.1);
            color: #dc2626;
            border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            transition: width 0.3s ease;
        }
        
        .footer {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .footer-content {
            color: #64748b;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .footer-highlight {
            color: #667eea;
            font-weight: 600;
        }
        
        .refresh-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }
        
        .refresh-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">
                <svg class="logo-svg" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="12" fill="url(#gradient)"/>
                    <path d="M24 12L32 20H28V36H20V20H16L24 12Z" fill="white"/>
                    <circle cx="24" cy="30" r="3" fill="url(#gradient2)"/>
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#667eea"/>
                            <stop offset="100%" stop-color="#764ba2"/>
                        </linearGradient>
                        <linearGradient id="gradient2" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#ffffff"/>
                            <stop offset="100%" stop-color="#f1f5f9"/>
                        </linearGradient>
                    </defs>
                </svg>
                <div class="logo-text">TurboHits</div>
            </div>
            <div class="nav-menu">
                <a href="/" class="nav-item active">Dashboard</a>
                <a href="http://localhost:3000" class="nav-item">Analytics</a>
                <a href="#" class="nav-item" onclick="alert('Settings coming soon!')">Settings</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="hero-section">
            <h1 class="hero-title">Traffic Analytics</h1>
            <p class="hero-subtitle">Real-time monitoring and analytics for your traffic generation system</p>
            <div class="status-badge">
                <i class="fas fa-circle"></i>
                System Active
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon">
                        <i class="fas fa-eye"></i>
                    </div>
                    <button class="refresh-btn" onclick="location.reload()">
                        <i class="fas fa-sync"></i>
                    </button>
                </div>
                <div class="stat-value" id="totalVisits">0</div>
                <div class="stat-label">Total Visits</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
                <div class="stat-value" id="successfulVisits">0</div>
                <div class="stat-label">Successful Visits</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon">
                        <i class="fas fa-times-circle"></i>
                    </div>
                </div>
                <div class="stat-value" id="failedVisits">0</div>
                <div class="stat-label">Failed Visits</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon">
                        <i class="fas fa-percentage"></i>
                    </div>
                </div>
                <div class="stat-value" id="successRate">0%</div>
                <div class="stat-label">Success Rate</div>
            </div>
        </div>
        
        <div class="content-section">
            <h2 class="section-title">
                <div class="section-icon">
                    <i class="fas fa-globe"></i>
                </div>
                Target URLs Performance
            </h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Website</th>
                        <th>Visits</th>
                        <th>Success Rate</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="urlsTable">
                    <tr>
                        <td><strong>digitalproductssssss.blogspot.com</strong></td>
                        <td><span id="blogVisits">0</span></td>
                        <td>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 100%"></div>
                            </div>
                        </td>
                        <td><span class="status-indicator status-active"><i class="fas fa-circle"></i> Active</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="content-section">
            <h2 class="section-title">
                <div class="section-icon">
                    <i class="fas fa-desktop"></i>
                </div>
                Browser Distribution
            </h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Browser</th>
                        <th>Visits</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody id="userAgentsTable">
                    <tr>
                        <td>Chrome Desktop</td>
                        <td>0</td>
                        <td>0%</td>
                    </tr>
                    <tr>
                        <td>Firefox Desktop</td>
                        <td>0</td>
                        <td>0%</td>
                    </tr>
                    <tr>
                        <td>Safari Mobile</td>
                        <td>0</td>
                        <td>0%</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="content-section">
            <h2 class="section-title">
                <div class="section-icon">
                    <i class="fas fa-external-link-alt"></i>
                </div>
                Traffic Sources
            </h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Source</th>
                        <th>Visits</th>
                        <th>Share</th>
                    </tr>
                </thead>
                <tbody id="referrersTable">
                    <tr>
                        <td>Google Search</td>
                        <td>0</td>
                        <td>0%</td>
                    </tr>
                    <tr>
                        <td>Facebook</td>
                        <td>0</td>
                        <td>0%</td>
                    </tr>
                    <tr>
                        <td>Direct Traffic</td>
                        <td>0</td>
                        <td>0%</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <div class="footer-content">
                Last updated: <span id="lastUpdated" class="footer-highlight">Never</span> • 
                Status: <span class="footer-highlight">ACTIVE</span> • 
                Port: <span class="footer-highlight">5000</span>
            </div>
        </div>
    </div>

    <script>
        // Auto-refresh every 10 seconds
        setInterval(() => {
            fetch('/api/stats')
                .then(response => response.json())
                .then(data => {
                    updateDashboard(data);
                })
                .catch(err => console.error('Error fetching stats:', err));
        }, 10000);

        function updateDashboard(data) {
            document.getElementById('totalVisits').textContent = data.totalVisits;
            document.getElementById('successfulVisits').textContent = data.successfulVisits;
            document.getElementById('failedVisits').textContent = data.failedVisits;
            
            const successRate = data.totalVisits > 0 ? 
                Math.round((data.successfulVisits / data.totalVisits) * 100) : 0;
            document.getElementById('successRate').textContent = successRate + '%';
            
            document.getElementById('lastUpdated').textContent = 
                new Date(data.lastUpdated).toLocaleString();
        }

        // Initial load
        fetch('/api/stats')
            .then(response => response.json())
            .then(data => updateDashboard(data))
            .catch(err => console.error('Error fetching stats:', err));
    </script>
</body>
</html>
    `);
});

// API endpoint to get stats
app.get('/api/stats', (req, res) => {
    res.json(trafficData);
});

// API endpoint to update stats
app.post('/api/update', (req, res) => {
    const { url, userAgent, referrer, success, error } = req.body;
    
    // Update counters
    trafficData.totalVisits++;
    if (success) {
        trafficData.successfulVisits++;
    } else {
        trafficData.failedVisits++;
    }
    
    // Update hourly stats
    const hour = new Date().getHours();
    trafficData.visitsByHour[hour] = (trafficData.visitsByHour[hour] || 0) + 1;
    
    // Update user agents
    const browserName = getBrowserName(userAgent);
    trafficData.userAgents[browserName] = (trafficData.userAgents[browserName] || 0) + 1;
    
    // Update referrers
    const referrerName = getReferrerName(referrer);
    trafficData.referrers[referrerName] = (trafficData.referrers[referrerName] || 0) + 1;
    
    // Update URLs
    trafficData.urls[url] = (trafficData.urls[url] || 0) + 1;
    
    // Log errors
    if (error) {
        trafficData.errors.push({
            url,
            error,
            timestamp: new Date()
        });
        
        // Keep only last 50 errors
        if (trafficData.errors.length > 50) {
            trafficData.errors = trafficData.errors.slice(-50);
        }
    }
    
    trafficData.lastUpdated = new Date();
    
    res.json({ success: true });
});

// Helper functions
function getBrowserName(userAgent) {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
}

function getReferrerName(referrer) {
    if (!referrer) return 'Direct';
    if (referrer.includes('google.com')) return 'Google';
    if (referrer.includes('facebook.com')) return 'Facebook';
    if (referrer.includes('twitter.com')) return 'Twitter';
    if (referrer.includes('linkedin.com')) return 'LinkedIn';
    if (referrer.includes('youtube.com')) return 'YouTube';
    if (referrer.includes('reddit.com')) return 'Reddit';
    if (referrer.includes('bing.com')) return 'Bing';
    if (referrer.includes('duckduckgo.com')) return 'DuckDuckGo';
    return 'Other';
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Traffic Bot Dashboard running at http://localhost:${PORT}`);
    console.log(`📊 Monitor your blog traffic in real-time!`);
});

module.exports = app;