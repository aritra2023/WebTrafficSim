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
    <title>Traffic Bot Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .dashboard {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 1.1em;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 30px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
        }
        
        .stat-card.success {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .stat-card.error {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }
        
        .stat-card.rate {
            background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
            color: #333;
        }
        
        .stat-number {
            font-size: 3em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .stat-label {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .details-section {
            padding: 0 30px 30px;
        }
        
        .section-title {
            font-size: 1.5em;
            margin-bottom: 20px;
            color: #333;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .data-table th,
        .data-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .data-table th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
        }
        
        .data-table tr:hover {
            background: #f8f9ff;
        }
        
        .status-indicator {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.9em;
            font-weight: 500;
        }
        
        .status-online {
            background: #4ade80;
            color: white;
        }
        
        .status-offline {
            background: #f87171;
            color: white;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 10px;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transition: width 0.3s ease;
        }
        
        .last-updated {
            text-align: center;
            color: #666;
            font-size: 0.9em;
            padding: 20px;
            background: #f8f9ff;
        }
        
        .url-highlight {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        
        .refresh-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1em;
            transition: transform 0.3s ease;
        }
        
        .refresh-btn:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>🚀 Traffic Bot Dashboard</h1>
            <p>Real-time monitoring of your blog traffic generation</p>
            <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Data</button>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number" id="totalVisits">0</div>
                <div class="stat-label">Total Visits</div>
            </div>
            
            <div class="stat-card success">
                <div class="stat-number" id="successfulVisits">0</div>
                <div class="stat-label">Successful Visits</div>
            </div>
            
            <div class="stat-card error">
                <div class="stat-number" id="failedVisits">0</div>
                <div class="stat-label">Failed Visits</div>
            </div>
            
            <div class="stat-card rate">
                <div class="stat-number" id="successRate">0%</div>
                <div class="stat-label">Success Rate</div>
            </div>
        </div>
        
        <div class="details-section">
            <h2 class="section-title">📊 Target URLs Performance</h2>
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
                        <td><span class="url-highlight">digitalproductssssss.blogspot.com</span></td>
                        <td>0</td>
                        <td>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                        </td>
                        <td><span class="status-indicator status-online">Active</span></td>
                    </tr>
                </tbody>
            </table>
            
            <h2 class="section-title">🌐 User Agents Distribution</h2>
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
            
            <h2 class="section-title">📈 Referrer Sources</h2>
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
        
        <div class="last-updated">
            <p>Last updated: <span id="lastUpdated">Never</span></p>
            <p>Dashboard URL: <strong>http://localhost:5000</strong></p>
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