# Limitless - Personal API Rate Limiter

Limitless is a productivity-focused rate limiting application designed to help you manage your digital habits through discipline, analytics, and AI-powered insights. It allows you to set strict rules on how often you perform specific actions—like opening social media or running resource-intensive scripts—and enforces these rules with a gamified penalty system.

## 🚀 Core Features

### 1. Advanced Rule Engine
Define custom constraints for any digital action:
- **Max Per Hour**: Limit usage frequency within short intervals.
- **Max Per Day**: Set daily quotas to prevent burnout or excessive use.
- **Cooldown Period**: Enforce a minimum waiting time between repeat actions.
- **Custom Penalties**: Define the "cost" of breaking a rule.

### 2. Override & Gamification
Total restriction often leads to rebellion. Limitless uses a "soft block" approach:
- **Overrides**: When a limit is reached, you can choose to bypass it.
- **Reputation Points**: Every override costs points. Maintain a high "Reputation" score to prove your discipline.
- **Visual Consequences**: Overrides are logged and highlighted in your history and analytics.

### 3. Analytics Dashboard
Visualize your self-discipline with high-fidelity charts:
- **Activity Trends**: Track your total actions over the last 7 days.
- **Action Distribution**: See which habits or scripts are consuming the most of your time/quota.
- **Quick Stats**: Real-time view of your Reputation Points, Total Overrides, and Penalty total.

### 4. AI Behavioral Insights
Leveraging the **Gemini 3.0 Flash API**, the app analyzes your recent logs to provide:
- **Pattern Recognition**: Identifies peak usage times or frequent override triggers.
- **Actionable Steps**: Specific advice on how to adjust your rules or environment to improve focus.
- **Encouraging Feedback**: Firm but supportive critique of your productivity trends.

## 🛠️ Tech Stack

- **Framework**: React 18/19 with TypeScript.
- **Styling**: Tailwind CSS for a modern, responsive UI.
- **Charts**: Recharts for performance-oriented data visualization.
- **AI Integration**: `@google/genai` (Gemini SDK).
- **Storage**: LocalStorage-based persistence for a zero-setup local experience.

## 📖 How to Use

1. **Dashboard**: Use the "Simulate Action" buttons to record activities. If a rule is violated, a modal will appear offering an override.
2. **Rule Manager**: Create new rules or click on existing ones to edit their constraints. Use the search bar to filter large lists of rules.
3. **History**: View a detailed audit trail of every success, block, and override.
4. **AI Insights**: Visit this tab to let the model process your data and provide personalized productivity coaching.

## 🛡️ Discipline First
This tool is built on the philosophy that **awareness is the first step to change**. By quantifying the "cost" of your distractions, you can build better digital boundaries.
