# LegionOS: AI-Powered Goal Achievement Platform

A comprehensive goal management ecosystem that transforms human aspirations into structured, achievable outcomes through intelligent conversation and systematic planning.

## Overview

LegionOS leverages advanced AI agents to provide personalized goal coaching, strategic planning assistance, and progress tracking capabilities. The platform combines natural language processing with proven goal-setting methodologies to help users create, manage, and achieve their personal and professional objectives.

## Core Features

**Intelligent Goal Creation**
Transform vague intentions into SMART goals through guided conversation and progressive questioning techniques that uncover deeper motivations and strategic insights.

**Multi-Agent Architecture**
Specialized AI agents work collaboratively to provide comprehensive goal management services, from initial consultation through achievement tracking and celebration.

**Export and Documentation**
Generate professional goal profiles in multiple formats including JSON, Markdown, CSV, and formatted reports for offline reference and sharing.

**Progress Tracking**
Monitor advancement across multiple goals with milestone management, achievement celebration, and strategic adjustment recommendations.

**Conversation Memory**
Maintain context across sessions with persistent memory that builds understanding of your goals, preferences, and progress patterns.

## Technology Stack

Built with modern web technologies for optimal performance and user experience:

- **Frontend**: Next.js 16 with React 19
- **UI Framework**: HeroUI components with Tailwind CSS
- **AI Framework**: Mastra for agent orchestration and workflow management
- **Database**: LibSQL for reliable data persistence
- **Animation**: Framer Motion for smooth user interactions
- **Type Safety**: TypeScript with Zod schema validation

## Development Setup

### Prerequisites

- Node.js 18 or higher
- Bun package manager (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/fozagtx/LegionOS.git
cd LegionOS

# Install dependencies
bun install

# Start development server
bun dev
```

### Build for Production

```bash
# Create production build
bun run build

# Start production server
bun start
```

## Architecture

### Agent System

**General Agent**: Primary interface for goal detection and conversation routing with comprehensive memory management for sustained coaching relationships.

**LegionOS Agent**: Specialized goal achievement coach with over 150 lines of carefully crafted instructions focusing on motivation psychology and systematic questioning techniques.

### Tool Integration

**Goal Creation Tool**: Sophisticated analysis engine that transforms conversational insights into structured goal profiles with confidence scoring and difficulty assessment.

**Export Tool**: Multi-format documentation generator creating professional reports, progress summaries, and shareable goal artifacts.

### Workflow Engine

**Goal Workflow**: Multi-phase process managing intent detection, information gathering, goal structuring, and export preparation with intelligent routing and error handling.

## Usage

### Starting a Goal Conversation

Initiate goal creation through natural conversation:

```
"I want to improve my health this year"
"I'm thinking about learning a new skill"
"Help me plan my career advancement"
```

### Export Options

Generate goal documentation in preferred formats:

- **Markdown**: Human-readable profiles for sharing and collaboration
- **JSON**: Complete structured data for analysis and integration
- **CSV**: Spreadsheet-compatible format for tracking and reporting
- **HTML**: Formatted reports ready for presentation and printing

### Progress Management

Track advancement through:

- Milestone completion monitoring
- Achievement celebration triggers
- Strategic adjustment recommendations
- Progress visualization and reporting

## Configuration

### Environment Variables

Create a `.env.local` file with required configuration:

```bash
OPENAI_API_KEY=your_openai_api_key
```

### Database Storage

The application uses LibSQL for data persistence with automatic setup:

- Goal profiles and progress data
- Conversation history and context
- User preferences and settings

## Contributing

We welcome contributions that enhance goal achievement capabilities:

1. Fork the repository
2. Create a feature branch
3. Implement changes with appropriate tests
4. Submit a pull request with detailed description

### Development Guidelines

- Follow TypeScript best practices with comprehensive type safety
- Maintain component isolation with clear interfaces
- Write meaningful commit messages describing changes
- Test goal creation workflows thoroughly before submission

## License

MIT License - see LICENSE file for details.

## Support

For questions, suggestions, or technical support, please open an issue on GitHub or contact the development team.

---

*LegionOS: Where human dreams meet artificial intelligence to create systematic achievement.*