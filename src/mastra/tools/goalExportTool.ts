import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import {
  Goal,
  GoalProfile,
  ExportFormat,
  MilestoneStatus,
  calculateGoalProgress,
  formatGoalDuration
} from '../../lib/goalTypes'

export const goalExportTool = createTool({
  id: 'export-goal',
  description: 'Export goal profiles in various formats (JSON, Markdown, PDF-ready) for download',
  inputSchema: z.object({
    goals: z.array(z.any()).describe('Array of goal objects to export'),
    format: z.nativeEnum(ExportFormat).describe('Export format'),
    includeProgress: z.boolean().default(true).describe('Include progress information'),
    includeMilestones: z.boolean().default(true).describe('Include milestone details'),
    includeReflections: z.boolean().default(false).describe('Include reflection notes'),
    userContext: z.object({
      name: z.string().optional(),
      timezone: z.string().optional(),
      exportDate: z.string().datetime().optional()
    }).optional().describe('User context for personalization'),
    customization: z.object({
      title: z.string().optional().describe('Custom title for export'),
      subtitle: z.string().optional().describe('Custom subtitle'),
      includeInsights: z.boolean().default(true).describe('Include AI insights'),
      includeRecommendations: z.boolean().default(true).describe('Include recommendations'),
      theme: z.enum(['default', 'minimal', 'detailed']).default('default').describe('Export theme style')
    }).optional()
  }),
  outputSchema: z.object({
    content: z.string().describe('Exported content in requested format'),
    filename: z.string().describe('Suggested filename for download'),
    mimeType: z.string().describe('MIME type for proper browser handling'),
    size: z.number().describe('Content size in bytes'),
    metadata: z.object({
      goalCount: z.number(),
      exportDate: z.string().datetime(),
      format: z.string(),
      version: z.string()
    }).describe('Export metadata')
  }),
  execute: async ({ context }) => {
    const {
      goals,
      format,
      includeProgress,
      includeMilestones,
      includeReflections,
      userContext,
      customization
    } = context

    const exportDate = new Date().toISOString()
    const theme = customization?.theme || 'default'

    // Generate content based on format
    let content: string
    let filename: string
    let mimeType: string

    switch (format) {
      case ExportFormat.JSON:
        content = generateJSONExport(goals, {
          includeProgress,
          includeMilestones,
          includeReflections,
          userContext,
          exportDate
        })
        filename = `machina-goals-${new Date().toISOString().split('T')[0]}.json`
        mimeType = 'application/json'
        break

      case ExportFormat.MARKDOWN:
        content = generateMarkdownExport(goals, {
          includeProgress,
          includeMilestones,
          includeReflections,
          userContext,
          customization,
          theme,
          exportDate
        })
        filename = `machina-goals-${new Date().toISOString().split('T')[0]}.md`
        mimeType = 'text/markdown'
        break

      case ExportFormat.CSV:
        content = generateCSVExport(goals, {
          includeProgress,
          includeMilestones
        })
        filename = `machina-goals-${new Date().toISOString().split('T')[0]}.csv`
        mimeType = 'text/csv'
        break

      case ExportFormat.PDF:
        // Generate PDF-ready HTML content
        content = generatePDFReadyHTML(goals, {
          includeProgress,
          includeMilestones,
          includeReflections,
          userContext,
          customization,
          theme,
          exportDate
        })
        filename = `machina-goals-${new Date().toISOString().split('T')[0]}.html`
        mimeType = 'text/html'
        break

      default:
        throw new Error(`Unsupported export format: ${format}`)
    }

    return {
      content,
      filename,
      mimeType,
      size: Buffer.byteLength(content, 'utf8'),
      metadata: {
        goalCount: goals.length,
        exportDate,
        format,
        version: '1.0'
      }
    }
  }
})

function generateJSONExport(goals: Goal[], options: any): string {
  const goalProfile: GoalProfile = {
    userContext: options.userContext || undefined,
    goals: goals.map(goal => ({
      ...goal,
      milestones: options.includeMilestones ? goal.milestones : [],
      reflection: options.includeReflections ? goal.reflection : undefined
    })),
    insights: options.includeProgress ? generateInsights(goals) : undefined,
    recommendations: generateRecommendations(goals),
    generatedAt: options.exportDate,
    version: '1.0'
  }

  return JSON.stringify(goalProfile, null, 2)
}

function generateMarkdownExport(goals: Goal[], options: any): string {
  const { userContext, customization, theme, exportDate } = options

  let content = ''

  // Header
  const title = customization?.title || `${userContext?.name ? userContext.name + "'s " : ""}Goal Profile`
  const subtitle = customization?.subtitle || `Generated by Machina Goal Management System`

  content += `# ${title}\n\n`
  content += `*${subtitle}*\n\n`
  content += `**Generated:** ${new Date(exportDate).toLocaleDateString()}\n`
  content += `**Goals Count:** ${goals.length}\n\n`

  content += `---\n\n`

  // Table of Contents
  content += `## 📋 Table of Contents\n\n`
  goals.forEach((goal, index) => {
    content += `${index + 1}. [${goal.title}](#${goal.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')})\n`
  })
  content += `\n---\n\n`

  // Goals Section
  content += `## 🎯 Goals\n\n`

  goals.forEach((goal, index) => {
    content += generateMarkdownGoal(goal, options, theme)
    if (index < goals.length - 1) content += `\n---\n\n`
  })

  // Insights and Recommendations
  if (customization?.includeInsights) {
    content += `\n## 💡 Insights\n\n`
    const insights = generateInsights(goals)
    insights.forEach(insight => {
      content += `- ${insight}\n`
    })
  }

  if (customization?.includeRecommendations) {
    content += `\n## 📈 Recommendations\n\n`
    const recommendations = generateRecommendations(goals)
    recommendations.forEach(recommendation => {
      content += `- ${recommendation}\n`
    })
  }

  // Footer
  content += `\n---\n\n`
  content += `*Generated by [Machina Goal Management System](https://github.com/machina) on ${new Date(exportDate).toLocaleDateString()}*\n`

  return content
}

function generateMarkdownGoal(goal: Goal, options: any, theme: string): string {
  let content = ''

  // Goal Header
  const progress = calculateGoalProgress(goal)
  const progressBar = generateProgressBar(progress)

  content += `### ${goal.title}\n\n`

  if (theme === 'detailed') {
    content += `**Type:** ${goal.type} | **Priority:** ${goal.priority} | **Status:** ${goal.status}\n\n`
  }

  if (options.includeProgress && progress > 0) {
    content += `**Progress:** ${progress.toFixed(1)}% ${progressBar}\n\n`
  }

  // Description
  if (goal.description) {
    content += `${goal.description}\n\n`
  }

  // Motivation
  if (goal.motivation) {
    content += `**💫 Why this matters:** ${goal.motivation}\n\n`
  }

  // Timeline
  const duration = formatGoalDuration(goal.startDate, goal.endDate)
  content += `**📅 Timeline:** ${duration}`
  if (goal.endDate) {
    content += ` (Due: ${new Date(goal.endDate).toLocaleDateString()})`
  }
  content += `\n\n`

  // Metrics
  if (goal.targetValue && goal.unit) {
    content += `**🎯 Target:** ${goal.targetValue} ${goal.unit}\n`
    if (options.includeProgress) {
      content += `**📊 Current:** ${goal.currentValue || 0} ${goal.unit}\n`
    }
    content += `\n`
  }

  // Milestones
  if (options.includeMilestones && goal.milestones.length > 0) {
    content += `**🎪 Milestones:**\n\n`
    goal.milestones.forEach(milestone => {
      const status = milestone.status === MilestoneStatus.COMPLETED ? '✅' :
                    milestone.status === MilestoneStatus.IN_PROGRESS ? '🔄' : '⭕'
      content += `- ${status} ${milestone.title}`
      if (milestone.dueDate) {
        content += ` *(Due: ${new Date(milestone.dueDate).toLocaleDateString()})*`
      }
      content += `\n`
      if (milestone.description) {
        content += `  - ${milestone.description}\n`
      }
    })
    content += `\n`
  }

  // Support System
  if (goal.accountability) {
    content += `**🤝 Accountability Partner:** ${goal.accountability}\n\n`
  }

  if (goal.resources && goal.resources.length > 0) {
    content += `**📚 Resources:**\n`
    goal.resources.forEach(resource => {
      content += `- ${resource}\n`
    })
    content += `\n`
  }

  // Obstacles
  if (goal.obstacles && goal.obstacles.length > 0) {
    content += `**⚠️ Anticipated Challenges:**\n`
    goal.obstacles.forEach(obstacle => {
      content += `- ${obstacle}\n`
    })
    content += `\n`
  }

  // Reward
  if (goal.reward) {
    content += `**🎉 Completion Reward:** ${goal.reward}\n\n`
  }

  // Tags
  if (goal.tags && goal.tags.length > 0) {
    content += `**🏷️ Tags:** ${goal.tags.map(tag => `\`${tag}\``).join(' ')}\n\n`
  }

  // Reflection
  if (options.includeReflections && goal.reflection) {
    content += `**💭 Reflection:** ${goal.reflection}\n\n`
  }

  return content
}

function generateCSVExport(goals: Goal[], options: any): string {
  const headers = [
    'Title',
    'Type',
    'Priority',
    'Status',
    'Start Date',
    'End Date',
    'Target Value',
    'Current Value',
    'Unit',
    'Progress %',
    'Motivation',
    'Accountability',
    'Tags'
  ]

  if (options.includeMilestones) {
    headers.push('Milestones Count', 'Completed Milestones')
  }

  let content = headers.join(',') + '\n'

  goals.forEach(goal => {
    const progress = calculateGoalProgress(goal)
    const completedMilestones = goal.milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length

    const row = [
      `"${goal.title.replace(/"/g, '""')}"`,
      goal.type,
      goal.priority,
      goal.status,
      new Date(goal.startDate).toLocaleDateString(),
      goal.endDate ? new Date(goal.endDate).toLocaleDateString() : '',
      goal.targetValue || '',
      goal.currentValue || 0,
      goal.unit || '',
      progress.toFixed(1),
      `"${(goal.motivation || '').replace(/"/g, '""')}"`,
      `"${(goal.accountability || '').replace(/"/g, '""')}"`,
      `"${(goal.tags || []).join('; ')}"`
    ]

    if (options.includeMilestones) {
      row.push(
        goal.milestones.length.toString(),
        completedMilestones.toString()
      )
    }

    content += row.join(',') + '\n'
  })

  return content
}

function generatePDFReadyHTML(goals: Goal[], options: any): string {
  const { userContext, customization, exportDate } = options

  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${customization?.title || 'Goal Profile'}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            line-height: 1.6;
            color: #134611;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fafef5;
        }
        .header { border-bottom: 3px solid #3da35d; margin-bottom: 30px; padding-bottom: 20px; }
        .header h1 { color: #134611; margin: 0; }
        .header p { color: #3e8914; margin: 5px 0; }
        .goal { margin-bottom: 40px; padding: 20px; background: white; border-left: 4px solid #96e072; border-radius: 8px; box-shadow: 0 2px 4px rgba(19,70,17,0.1); }
        .goal h2 { color: #134611; margin-top: 0; border-bottom: 1px solid #e8fccf; padding-bottom: 10px; }
        .progress-bar { width: 100%; height: 8px; background: #e8fccf; border-radius: 4px; overflow: hidden; margin: 10px 0; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #3da35d, #96e072); transition: width 0.3s ease; }
        .milestone { padding: 8px 12px; margin: 5px 0; background: #f1fde2; border-radius: 4px; border-left: 3px solid #96e072; }
        .milestone.completed { background: #d5f0de; border-left-color: #3da35d; }
        .tags { margin-top: 15px; }
        .tag { display: inline-block; background: #e8fccf; color: #134611; padding: 2px 8px; border-radius: 12px; font-size: 0.85em; margin: 2px; }
        .footer { margin-top: 40px; text-align: center; color: #3e8914; font-size: 0.9em; border-top: 1px solid #e8fccf; padding-top: 20px; }
        @media print {
            body { background: white; }
            .goal { box-shadow: none; border: 1px solid #e8fccf; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${customization?.title || `${userContext?.name ? userContext.name + "'s " : ""}Goal Profile`}</h1>
        <p>${customization?.subtitle || "Generated by Machina Goal Management System"}</p>
        <p><strong>Generated:</strong> ${new Date(exportDate).toLocaleDateString()} | <strong>Goals:</strong> ${goals.length}</p>
    </div>
`

  goals.forEach(goal => {
    const progress = calculateGoalProgress(goal)

    html += `
    <div class="goal">
        <h2>${goal.title}</h2>
        ${options.includeProgress && progress > 0 ? `
        <div style="margin: 15px 0;">
            <strong>Progress: ${progress.toFixed(1)}%</strong>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
        </div>
        ` : ''}

        ${goal.description ? `<p><strong>Goal:</strong> ${goal.description}</p>` : ''}
        ${goal.motivation ? `<p><strong>💫 Motivation:</strong> ${goal.motivation}</p>` : ''}

        <p><strong>📅 Timeline:</strong> ${formatGoalDuration(goal.startDate, goal.endDate)}${goal.endDate ? ` (Due: ${new Date(goal.endDate).toLocaleDateString()})` : ''}</p>

        ${goal.targetValue && goal.unit ? `
        <p><strong>🎯 Target:</strong> ${goal.targetValue} ${goal.unit}${options.includeProgress ? ` | <strong>Current:</strong> ${goal.currentValue || 0} ${goal.unit}` : ''}</p>
        ` : ''}

        ${options.includeMilestones && goal.milestones.length > 0 ? `
        <div style="margin-top: 20px;">
            <strong>🎪 Milestones:</strong>
            ${goal.milestones.map(milestone => `
            <div class="milestone ${milestone.status === MilestoneStatus.COMPLETED ? 'completed' : ''}">
                ${milestone.status === MilestoneStatus.COMPLETED ? '✅' : milestone.status === MilestoneStatus.IN_PROGRESS ? '🔄' : '⭕'}
                ${milestone.title}
                ${milestone.dueDate ? ` <em>(Due: ${new Date(milestone.dueDate).toLocaleDateString()})</em>` : ''}
            </div>
            `).join('')}
        </div>
        ` : ''}

        ${goal.accountability ? `<p><strong>🤝 Accountability:</strong> ${goal.accountability}</p>` : ''}
        ${goal.reward ? `<p><strong>🎉 Reward:</strong> ${goal.reward}</p>` : ''}

        ${goal.tags && goal.tags.length > 0 ? `
        <div class="tags">
            ${goal.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        ` : ''}
    </div>
    `
  })

  html += `
    <div class="footer">
        <p>Generated by <strong>Machina Goal Management System</strong></p>
        <p>Take action, track progress, achieve greatness. 🌟</p>
    </div>
</body>
</html>
`

  return html
}

function generateProgressBar(progress: number, length: number = 20): string {
  const filled = Math.round((progress / 100) * length)
  const empty = length - filled
  return '█'.repeat(filled) + '░'.repeat(empty) + ` ${progress.toFixed(1)}%`
}

function generateInsights(goals: Goal[]): string[] {
  const insights: string[] = []

  if (goals.length === 0) return insights

  // Goal type analysis
  const typeCount = goals.reduce((acc, goal) => {
    acc[goal.type] = (acc[goal.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const mostCommonType = Object.entries(typeCount)
    .sort(([,a], [,b]) => b - a)[0]

  if (mostCommonType) {
    insights.push(`You have a strong focus on ${mostCommonType[0]} goals (${mostCommonType[1]} out of ${goals.length} goals)`)
  }

  // Timeline analysis
  const activeGoals = goals.filter(g => g.status === 'active' || g.status === 'draft')
  if (activeGoals.length > 3) {
    insights.push(`You have ${activeGoals.length} active goals - consider prioritizing 2-3 key goals for better focus`)
  }

  // Progress analysis
  const goalsWithProgress = goals.filter(g => calculateGoalProgress(g) > 0)
  if (goalsWithProgress.length > 0) {
    const avgProgress = goalsWithProgress.reduce((sum, g) => sum + calculateGoalProgress(g), 0) / goalsWithProgress.length
    insights.push(`Your average progress across active goals is ${avgProgress.toFixed(1)}% - great momentum!`)
  }

  // Milestone analysis
  const totalMilestones = goals.reduce((sum, g) => sum + g.milestones.length, 0)
  if (totalMilestones > 0) {
    const completedMilestones = goals.reduce((sum, g) =>
      sum + g.milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length, 0)
    const milestoneCompletion = (completedMilestones / totalMilestones) * 100
    insights.push(`You've completed ${completedMilestones} out of ${totalMilestones} milestones (${milestoneCompletion.toFixed(1)}%)`)
  }

  return insights
}

function generateRecommendations(goals: Goal[]): string[] {
  const recommendations: string[] = []

  // Check for goals without deadlines
  const goalsWithoutDeadlines = goals.filter(g => !g.endDate && g.type !== 'habit')
  if (goalsWithoutDeadlines.length > 0) {
    recommendations.push(`Consider setting deadlines for ${goalsWithoutDeadlines.length} goals to improve focus and urgency`)
  }

  // Check for goals without accountability
  const goalsWithoutAccountability = goals.filter(g => !g.accountability)
  if (goalsWithoutAccountability.length > 0) {
    recommendations.push(`Add accountability partners to ${goalsWithoutAccountability.length} goals to increase success rates`)
  }

  // Check for goals without milestones
  const goalsWithoutMilestones = goals.filter(g => g.milestones.length === 0 && g.endDate)
  if (goalsWithoutMilestones.length > 0) {
    recommendations.push(`Break down ${goalsWithoutMilestones.length} long-term goals into smaller milestones for better tracking`)
  }

  // Check for overdue goals
  const overdueGoals = goals.filter(g => g.endDate && new Date(g.endDate) < new Date() && g.status !== 'completed')
  if (overdueGoals.length > 0) {
    recommendations.push(`Review and update ${overdueGoals.length} overdue goals - consider adjusting timelines or breaking them down`)
  }

  return recommendations
}