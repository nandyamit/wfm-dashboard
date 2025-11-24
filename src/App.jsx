import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Send, AlertTriangle, TrendingUp, Users, Phone, Clock, CheckCircle, XCircle, Mail, Download, Activity } from 'lucide-react';
import './WFMDashboard.css';

const WFMDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTyping, setIsTyping] = useState(false);
  const [showSimControls, setShowSimControls] = useState(false);
  const chatEndRef = useRef(null);

  // Dynamic data state that can be modified
  const [dynamicData, setDynamicData] = useState({
    serviceLevels: {
      billing: 76,
      customerSuccess: 92,
      technical: 68,
      sales: 95
    },
    volumes: {
      billing: 145,
      cancellations: 137,
      aiHandling: 37
    },
    alerts: {
      billingSpike: false,
      churnRisk: false,
      paymentFailures: false
    }
  });

  // Updated mock data using dynamic state
  const volumeData = [
    { time: '09:00', actual: 85, forecast: 80, handled: 82, humanHandled: 52, aiHandled: 30 },
    { time: '09:30', actual: 120, forecast: 90, handled: 115, humanHandled: 68, aiHandled: 47 },
    { time: '10:00', actual: 156, forecast: 110, handled: 140, humanHandled: 84, aiHandled: 56 },
    { time: '10:30', actual: 180, forecast: 120, handled: 165, humanHandled: 95, aiHandled: 70 },
    { time: '11:00', actual: 95, forecast: 100, handled: 95, humanHandled: 58, aiHandled: 37 },
    { time: '11:30', actual: 88, forecast: 90, handled: 88, humanHandled: 54, aiHandled: Math.max(20, dynamicData.volumes.aiHandling) },
  ];

  const serviceLevelData = [
    { time: '09:00', serviceLevel: 95, target: 85 },
    { time: '09:30', serviceLevel: 82, target: 85 },
    { time: '10:00', serviceLevel: 76, target: 85 },
    { time: '10:30', serviceLevel: 68, target: 85 },
    { time: '11:00', serviceLevel: 89, target: 85 },
    { time: '11:30', serviceLevel: dynamicData.serviceLevels.billing, target: 85 },
  ];

  // Human vs AI handling distribution
  const handlingDistribution = [
    { name: 'Human Agents', value: 411, percentage: 100 - dynamicData.volumes.aiHandling, color: '#3b82f6' },
    { name: 'AI Agents', value: 274, percentage: dynamicData.volumes.aiHandling, color: '#8b5cf6' },
  ];

  // Subscription business contact types
  const contactTypeData = [
    { name: 'Billing Issues', value: dynamicData.volumes.billing, color: '#ef4444' },
    { name: 'Cancellations', value: dynamicData.volumes.cancellations, color: '#f59e0b' },
    { name: 'Upgrades/Downgrades', value: 124, color: '#10b981' },
    { name: 'Technical Support', value: 98, color: '#3b82f6' },
    { name: 'New Subscriptions', value: 76, color: '#8b5cf6' },
    { name: 'Payment Failures', value: dynamicData.alerts.paymentFailures ? 95 : 61, color: '#ef4444' },
  ];

  const staffingData = [
    { name: 'Available', value: 45, color: '#10b981' },
    { name: 'On Call', value: 38, color: '#3b82f6' },
    { name: 'Break/Lunch', value: 12, color: '#f59e0b' },
    { name: 'Absent', value: 8, color: '#ef4444' },
  ];

  // Updated queue data using dynamic state
  const queueData = [
    { queue: 'Billing & Payments', volume: dynamicData.volumes.billing, waitTime: 45, agents: 12, serviceLevel: dynamicData.serviceLevels.billing, type: 'critical' },
    { queue: 'Customer Success', volume: 89, waitTime: 23, agents: 15, serviceLevel: dynamicData.serviceLevels.customerSuccess, type: 'retention' },
    { queue: 'Technical Support', volume: 67, waitTime: 67, agents: 8, serviceLevel: dynamicData.serviceLevels.technical, type: 'technical' },
    { queue: 'Sales & Upgrades', volume: 34, waitTime: 12, agents: 10, serviceLevel: dynamicData.serviceLevels.sales, type: 'revenue' },
  ];

  // Simulation functions
  const simulateConditions = {
    billingSpike: () => {
      setDynamicData(prev => ({
        ...prev,
        serviceLevels: { ...prev.serviceLevels, billing: Math.max(65, prev.serviceLevels.billing - 15) },
        volumes: { ...prev.volumes, billing: Math.min(250, prev.volumes.billing + 50) },
        alerts: { ...prev.alerts, billingSpike: true }
      }));
    },
    churnRisk: () => {
      setDynamicData(prev => ({
        ...prev,
        volumes: { ...prev.volumes, cancellations: Math.min(200, prev.volumes.cancellations + 30) },
        alerts: { ...prev.alerts, churnRisk: true }
      }));
    },
    aiPerformanceBoost: () => {
      setDynamicData(prev => ({
        ...prev,
        volumes: { ...prev.volumes, aiHandling: Math.min(50, prev.volumes.aiHandling + 10) }
      }));
    },
    paymentFailures: () => {
      setDynamicData(prev => ({
        ...prev,
        alerts: { ...prev.alerts, paymentFailures: true }
      }));
    },
    resetToNormal: () => {
      setDynamicData({
        serviceLevels: { billing: 85, customerSuccess: 92, technical: 75, sales: 95 },
        volumes: { billing: 145, cancellations: 137, aiHandling: 37 },
        alerts: { billingSpike: false, churnRisk: false, paymentFailures: false }
      });
    }
  };

  // AI bot responses and scenarios - more realistic and subscription focused
  const [aiState, setAiState] = useState({
    isMonitoring: true,
    lastAlert: null,
    waitingForResponse: false
  });

  const aiResponses = {
    billingSpike: {
      message: "🚨 **BILLING QUEUE ALERT** - Payment Failure Surge\n\n📊 **Current Situation:**\n- Billing queue volume up 67% vs forecast\n- 89% of contacts related to failed auto-renewals\n- Customer churn risk: HIGH (23 cancellation requests in last hour)\n\n🔍 **Root Cause Analysis:**\n- Payment processor experiencing 15% higher decline rates\n- Expired credit cards affecting 156 subscribers\n- Bank authentication timeouts reported\n\n💡 **Recommended Actions:**\n1. **Proactive outreach** - Email customers about payment updates\n2. **Temporary grace period** - Extend service by 48 hours\n3. **Escalate to Payment Ops** - investigate processor issues\n\nThis could prevent 50+ cancellations. Should I initiate the retention protocol?",
      actions: ['Start Retention Protocol', 'Escalate to Payment Ops', 'Send Customer Emails', 'View Churn Analytics']
    },
    aiPerformance: {
      message: "📈 **AI AGENT PERFORMANCE UPDATE**\n\n🤖 **AI Handling Metrics (Last Hour):**\n- **Resolution Rate:** 78% (up from 72% yesterday)\n- **Escalation Rate:** 22% (mainly billing disputes)\n- **Customer Satisfaction:** 4.1/5.0\n- **Average Handle Time:** 2.3 minutes\n\n✅ **Top AI Successes:**\n- Subscription modifications: 94% automated\n- Password resets: 98% automated\n- Plan comparisons: 89% automated\n\n⚠️ **Areas for Human Handoff:**\n- Billing disputes over $100\n- Cancellation saves (retention specialist needed)\n- Technical integration issues\n\nShall I adjust AI routing rules to capture more upgrade opportunities?",
      actions: ['Update AI Rules', 'Review Escalation Triggers', 'Analyze Conversation Logs', 'Schedule Training Update']
    },
    churnAlert: {
      message: "🚩 **CHURN RISK ALERT** - Retention Opportunity\n\n📊 **High-Value Customer at Risk:**\n- Customer: Enterprise Plan ($2,400/year)\n- Tenure: 18 months\n- Recent activity: 3 billing support contacts\n- Churn probability: 78%\n\n🎯 **Intervention Strategy:**\n1. **Immediate**: Senior customer success manager contact\n2. **Offer**: 3-month discount + dedicated support\n3. **Timeline**: Customer indicated decision by Friday\n\n💰 **Impact Analysis:**\n- Potential revenue loss: $2,400/year\n- Replacement cost: $1,200 (marketing + sales)\n- Total impact: $3,600\n\nShall I create the retention case and assign to Sarah (CSM)?",
      actions: ['Create Retention Case', 'Schedule Executive Call', 'Prepare Custom Offer', 'Send to CSM Queue']
    },
    reportGeneration: {
      message: "📊 **HOURLY SUBSCRIPTION METRICS REPORT**\n\n**Contact Volume Breakdown:**\n- Total Contacts: 685 (63% human, 37% AI handled)\n- Cancellations: 137 (⚠️ +15% vs forecast)\n- Upgrades: 124 (✅ +8% vs forecast)\n- Billing Issues: 189 (🔴 +45% vs forecast)\n\n**Revenue Impact:**\n- New MRR: +$12,450\n- Churn MRR: -$8,920\n- Net MRR: +$3,530\n\n**Key Insights:**\n- AI deflection saving ~4.2 FTE hours\n- Billing issues correlate with payment processor problems\n- Upgrade conversion rate: 23% (above target)\n\nShall I deep-dive into the billing issue root cause?",
      actions: ['Analyze Billing Issues', 'Export Detailed Report', 'Schedule Stakeholder Review', 'Create Action Items']
    }
  };

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      sender: 'ai',
      message: "👋 **WFM AI Assistant Ready**\n\nI'm monitoring your subscription business operations in real-time. I'll proactively alert you to:\n\n• Billing & payment issues affecting retention\n• Churn risks and intervention opportunities\n• AI vs human handling optimization\n• Service level impacts across all queues\n\nCurrently tracking 4 specialized queues with 45 active agents + AI automation. Monitoring 12,847 active subscribers. 🟢",
      timestamp: new Date(),
      type: 'welcome'
    };
    setMessages([welcomeMessage]);
  }, []);

  // Realistic AI alerts triggered by dynamic conditions
  useEffect(() => {
    // Simulate realistic monitoring conditions using dynamic data
    const monitoringChecks = [
      {
        condition: () => dynamicData.serviceLevels.billing < 80 && dynamicData.alerts.billingSpike,
        alert: 'billingSpike',
        delay: 2000
      },
      {
        condition: () => dynamicData.volumes.aiHandling > 40,
        alert: 'aiPerformance',
        delay: 3000
      },
      {
        condition: () => dynamicData.volumes.cancellations > 150 && dynamicData.alerts.churnRisk,
        alert: 'churnAlert', 
        delay: 2500
      },
      {
        condition: () => dynamicData.alerts.paymentFailures,
        alert: 'reportGeneration',
        delay: 3500
      }
    ];

    const timeouts = monitoringChecks.map(check => {
      if (check.condition() && !aiState.waitingForResponse) {
        return setTimeout(() => {
          if (!aiState.waitingForResponse && check.condition()) {
            const response = aiResponses[check.alert];
            const aiMessage = {
              id: messages.length + Math.random(),
              sender: 'ai',
              message: response.message,
              timestamp: new Date(),
              type: check.alert,
              actions: response.actions,
              priority: check.alert === 'churnAlert' ? 'high' : check.alert === 'billingSpike' ? 'medium' : 'normal'
            };
            setMessages(prev => [...prev, aiMessage]);
            setAiState(prev => ({ ...prev, lastAlert: check.alert, waitingForResponse: true }));
            
            // Reset the specific alert after triggering
            if (check.alert === 'billingSpike') {
              setDynamicData(prev => ({ ...prev, alerts: { ...prev.alerts, billingSpike: false } }));
            }
            if (check.alert === 'churnAlert') {
              setDynamicData(prev => ({ ...prev, alerts: { ...prev.alerts, churnRisk: false } }));
            }
            if (check.alert === 'reportGeneration') {
              setDynamicData(prev => ({ ...prev, alerts: { ...prev.alerts, paymentFailures: false } }));
            }
          }
        }, check.delay);
      }
      return null;
    }).filter(timeout => timeout !== null);

    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, [dynamicData, messages.length, aiState.waitingForResponse]);

  // Reset waiting state after user interaction
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].sender === 'user') {
      setAiState(prev => ({ ...prev, waitingForResponse: false }));
    }
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      message: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        message: `I understand you want to "${inputMessage}". I'm processing this request and will coordinate with the appropriate systems. This action will be logged in the audit trail.`,
        timestamp: new Date(),
        type: 'response'
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleActionClick = (action, messageType) => {
    const actionMessage = {
      id: messages.length + 1,
      sender: 'user',
      message: `✅ ${action}`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, actionMessage]);

    // Simulate AI confirmation
    setTimeout(() => {
      let responseText = '';
      switch (action) {
        case 'Start Retention Protocol':
          responseText = "✅ **Retention Protocol Activated**\n\n📧 **Actions Initiated:**\n- Proactive emails sent to 156 customers with payment issues\n- 48-hour service extension applied automatically\n- Customer success team alerted to high-value accounts at risk\n\n📊 **Expected Outcome:**\n- Projected churn reduction: 40-60%\n- Revenue protected: ~$47,000 MRR\n- Follow-up calls scheduled for Monday";
          break;
        case 'Escalate to Payment Ops':
          responseText = "🚀 **Payment Operations Escalated**\n\n📞 **Team Notified:**\n- Payment Gateway Team Lead: Sarah Chen\n- Banking Relations Manager: Mike Torres\n- Customer Communications: Lisa Wang\n\n⏱️ **SLA Timeline:**\n- Initial assessment: 30 minutes\n- Customer communication: 60 minutes\n- Resolution target: 4 hours\n\n🔄 **Next Steps:** Real-time monitoring dashboard activated for payment success rates.";
          break;
        case 'Create Retention Case':
          responseText = "📋 **High-Priority Retention Case Created**\n\n🎯 **Case Details:**\n- Case ID: RET-2024-1847\n- Assigned to: Sarah Martinez (Senior CSM)\n- Priority: URGENT (Enterprise Customer)\n- Auto-scheduled: Executive call within 2 hours\n\n💰 **Retention Package Prepared:**\n- 25% discount for 6 months\n- Dedicated technical support\n- Quarterly business reviews\n\n📅 **Timeline:** Customer expects decision by Friday 5 PM.";
          break;
        case 'Update AI Rules':
          responseText = "🤖 **AI Routing Rules Updated**\n\n⚙️ **Configuration Changes:**\n- Upgraded routing confidence threshold to 85%\n- Added billing dispute escalation triggers\n- Enhanced subscription modification workflows\n\n📈 **Expected Impact:**\n- 8% increase in AI resolution rate\n- 15% reduction in average handle time\n- Better capture of upsell opportunities\n\n🔄 **Deployment:** Changes active in 5 minutes.";
          break;
        case 'Analyze Billing Issues':
          responseText = "🔍 **Billing Issue Deep Dive Complete**\n\n📊 **Root Cause Analysis:**\n- 67% due to expired credit cards (seasonal pattern)\n- 23% payment processor timeouts (new issue)\n- 10% customer-initiated payment method changes\n\n💡 **Recommended Solutions:**\n1. Proactive card expiry notifications (30/15/7 days)\n2. Alternative payment method prompts\n3. Retry logic optimization\n\n🎯 **Quick Win:** Implementing smart retry logic could recover 40% of failed payments.";
          break;
        default:
          responseText = `✅ **Confirmed:** ${action} has been executed successfully. All relevant teams have been notified and actions are being tracked in our subscription management system.`;
      }

      const aiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        message: responseText,
        timestamp: new Date(),
        type: 'confirmation'
      };
      setMessages(prev => [...prev, aiMessage]);
      setAiState(prev => ({ ...prev, waitingForResponse: false }));
    }, 1500);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <Activity className="logo-icon" />
            </div>
            <div className="header-text">
              <h1 className="header-title">WFM AI Command Center</h1>
              <p className="header-subtitle">Real-time Contact Center Intelligence</p>
            </div>
          </div>
          <div className="header-right">
            <button 
              className="sim-toggle-btn"
              onClick={() => setShowSimControls(!showSimControls)}
              title="Toggle Simulation Controls"
            >
              🎮 Simulate
            </button>
            <div className="header-time">
              <div className="current-time">{currentTime.toLocaleTimeString()}</div>
              <div className="current-date">{currentTime.toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Simulation Controls */}
      {showSimControls && (
        <div className="simulation-controls">
          <div className="sim-header">
            <h3>🎮 Live Simulation Controls</h3>
            <p>Click buttons to trigger real-time conditions and see AI responses</p>
          </div>
          <div className="sim-buttons">
            <button 
              className="sim-btn sim-btn-critical"
              onClick={simulateConditions.billingSpike}
              title="Trigger billing queue service level drop"
            >
              🚨 Billing Spike
            </button>
            <button 
              className="sim-btn sim-btn-warning"
              onClick={simulateConditions.churnRisk}
              title="Increase cancellation volume"
            >
              📉 Churn Risk
            </button>
            <button 
              className="sim-btn sim-btn-info"
              onClick={simulateConditions.aiPerformanceBoost}
              title="Boost AI handling percentage"
            >
              🤖 AI Performance
            </button>
            <button 
              className="sim-btn sim-btn-warning"
              onClick={simulateConditions.paymentFailures}
              title="Trigger payment failure alerts"
            >
              💳 Payment Issues
            </button>
            <button 
              className="sim-btn sim-btn-normal"
              onClick={simulateConditions.resetToNormal}
              title="Reset all metrics to normal"
            >
              🔄 Reset All
            </button>
          </div>
          <div className="sim-status">
            <span>Current State:</span>
            <span className={`status-indicator ${dynamicData.serviceLevels.billing < 80 ? 'critical' : 'normal'}`}>
              Billing SL: {dynamicData.serviceLevels.billing}%
            </span>
            <span className={`status-indicator ${dynamicData.volumes.cancellations > 150 ? 'warning' : 'normal'}`}>
              Cancellations: {dynamicData.volumes.cancellations}
            </span>
            <span className={`status-indicator ${dynamicData.volumes.aiHandling > 40 ? 'info' : 'normal'}`}>
              AI Handling: {dynamicData.volumes.aiHandling}%
            </span>
          </div>
        </div>
      )}

      <div className="dashboard-main">
        {/* Main Dashboard */}
        <div className="dashboard-content">
          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon metric-icon-green">
                  <CheckCircle />
                </div>
                <span className="metric-change metric-change-positive">+5%</span>
              </div>
              <h3 className="metric-label">Service Level</h3>
              <p className="metric-value">89%</p>
              <p className="metric-target">Target: 85%</p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon metric-icon-blue">
                  <Phone />
                </div>
                <span className="metric-change metric-change-warning">+18%</span>
              </div>
              <h3 className="metric-label">Total Volume</h3>
              <p className="metric-value">2,847</p>
              <p className="metric-target">Today</p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon metric-icon-purple">
                  <Users />
                </div>
                <span className="metric-change metric-change-negative">-3</span>
              </div>
              <h3 className="metric-label">Available Agents</h3>
              <p className="metric-value">45</p>
              <p className="metric-target">of 48 scheduled</p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon metric-icon-cyan">
                  <Clock />
                </div>
                <span className="metric-change metric-change-positive">-12s</span>
              </div>
              <h3 className="metric-label">Avg Wait Time</h3>
              <p className="metric-value">28s</p>
              <p className="metric-target">Target: 30s</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            {/* Volume Trends with Human vs AI breakdown */}
            <div className="chart-container">
              <h3 className="chart-title">Volume vs Forecast (Human/AI Split)</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#ef4444" strokeWidth={3} name="Total Volume" />
                    <Line type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
                    <Line type="monotone" dataKey="humanHandled" stroke="#3b82f6" strokeWidth={2} name="Human Handled" />
                    <Line type="monotone" dataKey="aiHandled" stroke="#8b5cf6" strokeWidth={2} name="AI Handled" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Service Level */}
            <div className="chart-container">
              <h3 className="chart-title">Service Level Performance</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={serviceLevelData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" domain={[60, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="serviceLevel" stroke="#8b5cf6" strokeWidth={3} name="Service Level %" />
                    <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Target 85%" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* New Subscription Business Metrics */}
          <div className="subscription-metrics">
            {/* Human vs AI Handling */}
            <div className="chart-container">
              <h3 className="chart-title">Contact Handling Distribution</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={handlingDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="value"
                      label={({name, percentage}) => `${name}: ${percentage}%`}
                    >
                      {handlingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} contacts`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="metric-summary">
                <div className="metric-item">
                  <span className="metric-label">AI Efficiency</span>
                  <span className="metric-value-small">37%</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Avg Handle Time (AI)</span>
                  <span className="metric-value-small">2.3min</span>
                </div>
              </div>
            </div>

            {/* Contact Type Breakdown */}
            <div className="chart-container">
              <h3 className="chart-title">Subscription Contact Types</h3>
              <div className="contact-types">
                {contactTypeData.map((type, index) => (
                  <div key={index} className="contact-type-item">
                    <div className="contact-type-info">
                      <div 
                        className="contact-type-dot" 
                        style={{ backgroundColor: type.color }}
                      ></div>
                      <span className="contact-type-name">{type.name}</span>
                    </div>
                    <div className="contact-type-metrics">
                      <span className="contact-type-count">{type.value}</span>
                      <div className="contact-type-bar">
                        <div 
                          className="contact-type-fill"
                          style={{ 
                            width: `${(type.value / Math.max(...contactTypeData.map(t => t.value))) * 100}%`,
                            backgroundColor: type.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Distribution */}
            <div className="chart-container">
              <h3 className="chart-title">Agent Availability</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={staffingData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {staffingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Queue Performance */}
          <div className="queue-section">
            <div className="chart-container queue-performance">
              <h3 className="chart-title">Subscription Queue Performance</h3>
              <div className="queue-list">
                {queueData.map((queue, index) => (
                  <div key={index} className="queue-item">
                    <div className="queue-left">
                      <div className={`queue-status ${queue.serviceLevel >= 85 ? 'status-good' : queue.serviceLevel >= 75 ? 'status-warning' : 'status-critical'}`}></div>
                      <span className="queue-name">{queue.queue}</span>
                      <span className={`queue-type queue-type-${queue.type}`}>{queue.type}</span>
                    </div>
                    <div className="queue-metrics">
                      <span className="queue-metric">Vol: {queue.volume}</span>
                      <span className="queue-metric">Wait: {queue.waitTime}s</span>
                      <span className="queue-metric">Agents: {queue.agents}</span>
                      <span className={`queue-metric queue-sl ${queue.serviceLevel >= 85 ? 'sl-good' : queue.serviceLevel >= 75 ? 'sl-warning' : 'sl-critical'}`}>
                        SL: {queue.serviceLevel}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat Interface */}
        <div className="chat-container">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-header-content">
              <div className="ai-avatar">AI</div>
              <div className="ai-info">
                <h3 className="ai-name">WFM AI Assistant</h3>
                <div className="ai-status">
                  <div className="status-dot"></div>
                  <span className="status-text">Online & Monitoring</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender === 'user' ? 'message-user' : 'message-ai'}`}>
                <div className="message-content">
                  <div className="message-text">{msg.message}</div>
                  {msg.actions && (
                    <div className="message-actions">
                      {msg.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleActionClick(action, msg.type)}
                          className="action-button"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="message-time">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message message-ai">
                <div className="message-content">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="chat-input">
            <div className="input-container">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask AI to take action..."
                className="message-input"
              />
              <button onClick={sendMessage} className="send-button">
                <Send />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return <WFMDashboard />;
};

export default App;