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
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            min-height: 100vh;
        }
        
        .navbar {
            background: #1e293b;
            border-bottom: 1px solid #334155;
            padding: 0 2rem;
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        .nav-container {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 70px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            font-weight: bold;
        }
        
        .logo-text {
            font-size: 24px;
            font-weight: 700;
            color: #f1f5f9;
            letter-spacing: -0.5px;
        }
        
        .nav-menu {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-item {
            color: #94a3b8;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
        }
        
        .nav-item:hover, .nav-item.active {
            color: #3b82f6;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .page-header {
            margin-bottom: 2rem;
        }
        
        .page-title {
            font-size: 2rem;
            font-weight: 700;
            color: #f1f5f9;
            margin-bottom: 0.5rem;
        }
        
        .page-subtitle {
            color: #94a3b8;
            font-size: 1.1rem;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 1.5rem;
            transition: all 0.2s;
        }
        
        .stat-card:hover {
            border-color: #3b82f6;
            transform: translateY(-2px);
        }
        
        .stat-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
        }
        
        .stat-icon {
            width: 48px;
            height: 48px;
            background: rgba(59, 130, 246, 0.1);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #3b82f6;
            font-size: 20px;
        }
        
        .stat-value {
            font-size: 2.25rem;
            font-weight: 700;
            color: #f1f5f9;
            margin-bottom: 0.25rem;
        }
        
        .stat-label {
            color: #94a3b8;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .details-section {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .section-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #f1f5f9;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .data-table th,
        .data-table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #334155;
        }
        
        .data-table th {
            background: #0f172a;
            color: #94a3b8;
            font-weight: 500;
            font-size: 0.875rem;
        }
        
        .data-table td {
            color: #e2e8f0;
        }
        
        .data-table tr:hover {
            background: rgba(59, 130, 246, 0.05);
        }
        
        .status-indicator {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .status-active {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
        }
        
        .status-inactive {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }
        
        .progress-bar {
            width: 100%;
            height: 6px;
            background: #334155;
            border-radius: 3px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: #3b82f6;
            transition: width 0.3s ease;
        }
        
        .footer {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
        }
        
        .footer-content {
            color: #94a3b8;
            font-size: 0.875rem;
        }
        
        .footer-highlight {
            color: #3b82f6;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">
                <div class="logo-icon">TH</div>
                <div class="logo-text">TurboHits</div>
            </div>
            <div class="nav-menu">
                <a href="/" class="nav-item active">Dashboard</a>
                <a href="http://localhost:3000" class="nav-item">Analytics</a>
                <a href="#" class="nav-item">Settings</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="page-header">
            <h1 class="page-title">Traffic Analytics Dashboard</h1>
            <p class="page-subtitle">Real-time monitoring of your traffic generation system</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon">
                        <i class="fas fa-eye"></i>
                    </div>
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
        
        <div class="details-section">
            <h2 class="section-title">
                <i class="fas fa-globe"></i>
                Target URLs Performance
            </h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>URL</th>
                        <th>Visits</th>
                        <th>Success Rate</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="urlsTable">
                    <tr>
                        <td>digitalproductssssss.blogspot.com</td>
                        <td>0</td>
                        <td>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                        </td>
                        <td><span class="status-indicator status-active">Active</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="details-section">
            <h2 class="section-title">
                <i class="fas fa-desktop"></i>
                User Agents Distribution
            </h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Browser</th>
                        <th>Count</th>
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
        
        <div class="details-section">
            <h2 class="section-title">
                <i class="fas fa-external-link-alt"></i>
                Referrer Sources
            </h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Source</th>
                        <th>Visits</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody id="referrersTable">
                    <tr>
                        <td>Google</td>
                        <td>0</td>
                        <td>0%</td>
                    </tr>
                    <tr>
                        <td>Facebook</td>
                        <td>0</td>
                        <td>0%</td>
                    </tr>
                    <tr>
                        <td>Direct</td>
                        <td>0</td>
                        <td>0%</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <div class="footer-content">
                Last updated: <span id="lastUpdated" class="footer-highlight">Never</span> | 
                Status: <span class="footer-highlight">ACTIVE</span> | 
                Dashboard: <span class="footer-highlight">http://localhost:5000</span>
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