# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## The Machina Chronicles: A Developer's Guide to AI-Powered Goal Achievement

*In the realm of digital aspirations, where human dreams meet artificial intelligence, lies the story of Machina - a sophisticated goal management ecosystem that transforms vague intentions into structured, achievable outcomes.*

### Chapter 1: The Genesis of Machina

Once upon a time, in the digital landscape of personal productivity, there existed an opportunity to create something transformative. Through the alchemy of intelligent design and sophisticated AI architecture, **Machina** emerged - a comprehensive goal management platform that bridges the gap between human aspiration and systematic achievement.

## Development Commands: The Incantations of Creation

In the sacred ritual of development, these commands hold the power to breathe life into Machina:

- **`bun dev`** - Summons the development server with webpack enchantments, opening a portal to the live application
- **`bun run build`** - Forges the production-ready artifacts through webpack's transformative fire
- **`bun start`** - Awakens the production server, ready to serve users their goal-achieving destiny

*Always use bun - it is the chosen tool of this realm, faster and more reliable than its ancient npm predecessor.*

### Chapter 2: The Architecture of Dreams

At the heart of Machina lies a sophisticated tapestry woven from multiple technological threads, each serving a crucial purpose in the grand design of goal achievement.

## The Mastra Foundation: Where Magic Meets Logic

**Mastra** serves as the foundational framework - not merely a tool, but the very soul of the application. It provides:

### The Trinity of Intelligence
1. **Agent System**: A council of specialized AI entities, each with distinct personalities and capabilities
2. **Tool Integration**: Mystical implements that connect the digital realm to real-world data
3. **Workflow Engine**: Orchestrated sequences that transform chaos into order, questions into plans

## The Great Color Transformation: A Palette Reborn

Where once lived the darkness of grays and blacks, now flourishes a verdant ecosystem of greens:

### The Five Sacred Hues
- **Black Forest** (`#134611`): The deep, wise foundation - used for primary headers and navigation
- **India Green** (`#3e8914`): The active energy - for secondary actions and highlights
- **Medium Jungle** (`#3da35d`): The balanced core - for content areas and cards
- **Light Green** (`#96e072`): The interactive spirit - for buttons and user interactions
- **Frosted Mint** (`#e8fccf`): The gentle background - for subtle accents and breathing space

Each color exists in a spectrum from 100 (darkest) to 900 (lightest), creating a harmonious gradient system that guides users through their goal-achievement journey.

### Chapter 3: The Dramatis Personae - Agent Architecture

In this digital drama, three primary characters play crucial roles:

## The General Agent: The Wise Counselor
*Location: `/src/mastra/agents/general-agent.ts`*

Once a simple assistant, now evolved into a sophisticated goal management counselor. This agent serves as the primary interface, capable of:
- Detecting goal-related intentions in user messages
- Routing conversations to specialized agents
- Maintaining comprehensive memory across sessions (20 messages)
- Coordinating with specialized goal agents for complex tasks

**Key Capabilities:**
- Goal detection through keyword analysis
- Workflow orchestration for structured goal creation
- Dedicated goal management tools and workflows
- Voice integration for accessibility

## The Machina Agent: The Master of Goals
*Location: `/src/mastra/agents/machinaAgent.ts`*

The true heart of the goal management system - a sophisticated coach that understands the psychology of achievement. With over 150 lines of carefully crafted instructions, it embodies:

**The Art of Questioning:**
- Progressive inquiry techniques that uncover deeper motivations
- Context-aware questioning based on goal types (fitness, learning, career)
- Strategic probing that reveals obstacles and resources
- Adaptive conversation flow that builds trust and understanding

**The Science of Goal Structure:**
- SMART goal methodology (Specific, Measurable, Achievable, Relevant, Time-bound)
- Milestone decomposition for complex objectives
- Progress tracking mechanisms
- Accountability system integration

**The Psychology of Motivation:**
- Warm, encouraging communication style
- Focus on possibility rather than limitations
- Celebration of progress and achievements
- Personal value alignment


### Chapter 4: The Artifact System - Tools of Transformation

## The Goal Creation Tool: The Architect of Dreams
*Location: `/src/mastra/tools/goalCreationTool.ts`*

This sophisticated instrument transforms conversational insights into structured goal profiles. It analyzes:

**Input Complexity:**
- Multi-dimensional goal context (timeframe, motivation, strategy)
- Milestone decomposition
- Support system identification
- Obstacle anticipation and mitigation planning

**Output Sophistication:**
- Complete goal objects with metadata
- Confidence scoring (0-1 scale)
- Difficulty assessment (easy → very_challenging)
- Success probability calculations
- Actionable recommendations for improvement

**Intelligence Features:**
- Automatic milestone generation based on goal duration
- Tag creation from conversation context
- Priority assignment based on language patterns
- Timeline optimization for achievability

## The Export Tool: The Chronicler of Progress
*Location: `/src/mastra/tools/goalExportTool.ts`*

A master of documentation that transforms digital goals into tangible artifacts:

**Format Mastery:**
- **JSON**: Complete structured data with metadata
- **Markdown**: Human-readable profiles with progress visualization
- **CSV**: Spreadsheet-compatible goal tracking
- **HTML/PDF**: Beautifully formatted reports ready for printing

**Content Intelligence:**
- Progress bar generation using Unicode characters
- Insight extraction from goal patterns
- Recommendation engine for goal improvement
- Risk assessment and mitigation suggestions

**Customization Options:**
- Theme selection (default, minimal, detailed)
- Content filtering (progress, milestones, reflections)
- User personalization (name, timezone)
- Custom titles and branding

### Chapter 5: The Workflow Symphony - Goal Creation Orchestra

*Location: `/src/mastra/workflows/goalWorkflow.ts`*

The workflow represents the culmination of Machina's intelligence - a multi-step process that transforms vague intentions into concrete action plans:

## The Four Movements

### Movement I: Analysis (Allegro)
- Intent classification (goal_creation, refinement, progress_update)
- Information extraction using pattern recognition
- Confidence calculation based on completeness
- Missing element identification

### Movement II: Interrogation (Andante)
- Intelligent question generation based on gaps
- Priority-based question ordering
- Context-sensitive follow-ups
- Goal-type specific inquiries

### Movement III: Creation (Presto)
- Goal profile assembly using extracted information
- Milestone generation and timeline optimization
- Confidence assessment and recommendation generation
- Success probability calculation

### Movement IV: Export (Finale)
- Format selection and content generation
- Download preparation with proper MIME types
- File naming conventions with timestamps
- Error handling and fallback mechanisms

### Chapter 6: The Visual Symphony - UI Architecture

## The Goal Profile Display: Claude Artifacts Reborn
*Location: `/src/components/goalProfileDisplay.tsx`*

This component represents the visual culmination of the goal creation process - an expandable, interactive artifact that rivals Claude's own artifacts system:

**Artifact-Style Features:**
- Expandable goal profiles with smooth animations
- Real-time progress visualization
- Milestone tracking with status indicators
- Interactive export options
- Drag-and-drop milestone reordering (future enhancement)

**Visual Hierarchy:**
- Card-based layout with depth and shadow
- Color-coded status indicators
- Progress bars with gradient fills
- Tag clouds for categorization
- Timeline visualization

**Interaction Design:**
- Hover effects and micro-animations
- Click-to-expand details
- Inline editing capabilities (planned)
- Export buttons with format selection
- Delete and edit operations

## The Main Interface: The Theater of Goals
*Location: `/src/app/page.tsx`*

The primary stage where human and AI interact in the dance of goal creation:

**Layout Design:**
- Two-column layout: Chat (67%) + Goal Profile (33%)
- Responsive design with mobile-first approach
- Sticky sidebar for persistent goal visibility
- Smooth transitions between states

**Chat Interface:**
- Welcome message with suggested prompts
- Animated typing indicators
- Message threading with role-based styling
- Error handling with user-friendly messages
- Auto-scroll and keyboard navigation

**Goal Detection Intelligence:**
- Keyword-based routing to goal agent
- Automatic goal profile updates
- Export functionality with download handling
- Goal management (edit, delete, duplicate)

### Chapter 7: The Memory Palace - Data Persistence

## Storage Architecture

**Multi-Tiered Persistence:**
- **Main Storage**: `file:../mastra_storage.db` - Central repository for all system data
- **Agent Memory**: `file:../general_agent_memory.db` - Conversation history and context
- **Goal Memory**: `file:../machina_goals.db` - Dedicated goal-specific storage

**Memory Patterns:**
```typescript
// Thread-based conversations for goal continuity
memory: {
  thread: threadId,    // Goal session identifier
  resource: userId     // User identification
}

// Extended memory windows for complex goal conversations
options: {
  lastMessages: 20     // Enhanced for comprehensive goal discussions
}
```

## Data Flow Architecture

**Goal Creation Journey:**
1. User Input → Intent Detection → Agent Routing
2. Conversation → Context Building → Information Extraction
3. Tool Invocation → Goal Creation → Profile Generation
4. UI Update → Export Options → Persistence

**Export Pipeline:**
1. Goal Selection → Format Choice → Tool Invocation
2. Content Generation → File Preparation → Download Trigger
3. Success Feedback → Error Handling → User Notification

### Chapter 8: The Development Ecosystem

## File Organization Philosophy

**CamelCase Convention:**
All component files follow camelCase naming for consistency and readability:
- `goalProfileDisplay.tsx` - Main goal UI component
- `goalCreationTool.ts` - Goal creation logic
- `machinaAgent.ts` - Primary goal agent

**Single-File Features:**
Each feature is implemented as a self-contained unit when possible:
- Complete functionality within one file
- Minimal external dependencies
- Clear input/output interfaces
- Comprehensive error handling

## TypeScript Integration

**Comprehensive Type Safety:**
- Zod schemas for runtime validation
- TypeScript interfaces for compile-time safety
- Enum definitions for controlled vocabularies
- Generic types for flexible components

**Key Type Definitions:**
```typescript
Goal, GoalProfile, ExportFormat, GoalType
Priority, GoalStatus, MilestoneStatus
GoalCreationContext, AgentQuestion
```

### Chapter 9: The Integration Tapestry

## Mastra Configuration Mastery
*Location: `/src/mastra/index.ts`*

The central nervous system that connects all components:

**Agent Registration:**
- `generalAgent` - Primary interface and goal router
- `machinaAgent` - Specialized goal achievement coach

**Workflow Orchestra:**
- `goal-workflow` - Comprehensive goal creation and management pipeline

**Tool Arsenal:**
- Goal creation and export tools
- Progress tracking and analytics
- Memory management utilities

## Server Action Architecture
*Location: `/src/lib/goalAgent.ts`*

The bridge between frontend interactivity and backend intelligence:

**Core Functions:**
- `runGoalAgent()` - Primary goal interaction
- `exportGoals()` - Multi-format export handling
- `updateGoalProgress()` - Progress tracking
- `getGoalRecommendations()` - AI-driven insights

**Error Handling Philosophy:**
- Graceful degradation for tool failures
- User-friendly error messages
- Fallback mechanisms for export functions
- Logging for debugging and improvement

### Chapter 10: The Color Psychology

## The Science of Green

The choice of green as the primary color palette reflects deep psychological principles:

**Green's Psychological Impact:**
- **Growth and Progress**: Encourages forward movement toward goals
- **Balance and Harmony**: Creates calm, focused environment for planning
- **Nature and Renewal**: Connects goal achievement to natural cycles
- **Hope and Optimism**: Supports positive mindset essential for success

**Color Hierarchy in Practice:**
- **Dark Greens**: Authority and trustworthiness for headers and navigation
- **Medium Greens**: Active engagement for buttons and interactive elements
- **Light Greens**: Success and progress for completion indicators
- **Mint Tones**: Gentle guidance for backgrounds and subtle accents

### Chapter 11: The Export Ecosystem

## Multi-Format Intelligence

Each export format serves specific user needs:

**Markdown Export:**
- Human-readable format for sharing and collaboration
- GitHub-compatible for version control
- Rich formatting with progress indicators
- Customizable themes and layouts

**JSON Export:**
- Machine-readable for data analysis
- Backup and migration capabilities
- Integration with other tools
- Complete metadata preservation

**HTML/PDF Export:**
- Professional presentation format
- Printable for offline reference
- Styled with CSS for visual appeal
- Embedded images and charts (planned)

**CSV Export:**
- Spreadsheet compatibility
- Data analysis and reporting
- Progress tracking over time
- Simple format for basic tools

### Chapter 12: The Intelligence Layer

## AI-Powered Insights

**Goal Analysis Intelligence:**
- Pattern recognition across user goals
- Success probability calculations
- Risk assessment and mitigation suggestions
- Personalized coaching recommendations

**Conversation Intelligence:**
- Intent detection and classification
- Context preservation across sessions
- Adaptive questioning based on responses
- Emotional tone recognition and adjustment

**Progress Intelligence:**
- Automatic milestone suggestions
- Timeline optimization
- Obstacle prediction and planning
- Achievement celebration triggers

### Chapter 13: The User Experience Philosophy

## Conversational Design Principles

**Natural Language Processing:**
- Flexible input handling for various expression styles
- Context-aware responses that build on previous exchanges
- Graceful handling of incomplete or unclear requests
- Progressive disclosure of complexity

**Motivation and Engagement:**
- Positive reinforcement for progress
- Celebration of achievements and milestones
- Gentle guidance for course correction
- Personal connection through consistent personality

## Accessibility Considerations

**Universal Design:**
- Keyboard navigation support
- Screen reader compatibility
- Color contrast adherence to WCAG guidelines
- Font size and spacing optimization

**Mobile Responsiveness:**
- Touch-friendly interface elements
- Responsive layout adaptation
- Gesture support for common actions
- Optimized loading for mobile networks

### Chapter 14: The Performance Architecture

## Optimization Strategies

**Frontend Performance:**
- Component lazy loading for large goal lists
- Virtual scrolling for extensive conversation history
- Image optimization for progress visualizations
- Animation performance tuning

**Backend Performance:**
- Database indexing for quick goal retrieval
- Caching strategies for frequently accessed data
- Batch processing for bulk operations
- Connection pooling for database efficiency

**Memory Management:**
- Conversation history pruning
- Goal archive and active separation
- Temporary file cleanup
- Session state optimization

### Chapter 15: The Security Framework

## Data Protection Philosophy

**Privacy by Design:**
- Local storage preference for sensitive goal data
- Minimal data collection principles
- User consent for data usage
- Transparent privacy policies

**Security Measures:**
- Server-side API key management
- Input sanitization and validation
- SQL injection prevention
- Cross-site scripting protection

### Chapter 16: The Future Roadmap

## Planned Enhancements

**Advanced Features:**
- Calendar integration for goal deadlines
- Collaboration features for shared goals
- Achievement badges and gamification
- Social sharing for milestone celebrations

**Intelligence Improvements:**
- Machine learning for personalized recommendations
- Natural language understanding enhancements
- Predictive analytics for success probability
- Emotional intelligence in conversation

**Integration Expansion:**
- Third-party app connections (Todoist, Notion)
- Wearable device integration for activity tracking
- Email reminders and progress reports
- Mobile app companion

### Epilogue: The Living System

Machina is not merely an application - it is a living, breathing ecosystem that grows with its users. Every conversation enriches its understanding, every goal created expands its wisdom, and every achievement celebrated strengthens its ability to guide future aspirations.

The code within these files tells the story of transformation - creating a sophisticated goal achievement coaching system. It represents the marriage of human psychology and artificial intelligence, creating a system that doesn't just store goals but actively helps achieve them.

## Development Best Practices

**Code Organization:**
- Feature-based directory structure
- Single responsibility principle for components
- Comprehensive error handling
- Extensive documentation and comments

**Testing Philosophy:**
- Unit tests for goal creation logic
- Integration tests for workflow processes
- End-to-end tests for user journey validation
- Performance testing for large datasets

**Deployment Considerations:**
- Environment variable management
- Database migration strategies
- Rollback procedures for updates
- Monitoring and alerting systems

---

*Remember: Every line of code in Machina serves the ultimate purpose of helping humans achieve their dreams. Approach development with the same care and intention that users bring to their goals.*

**Last Updated**: December 2024
**Version**: 1.0 - The Foundation
**Next Chapter**: The Community Features (v1.1)