"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@heroui/button"
import { Card, CardBody, CardHeader } from "@heroui/card"
import { Progress } from "@heroui/progress"
import { Chip } from "@heroui/chip"
import { Divider } from "@heroui/divider"
import { Badge } from "@heroui/badge"
import {
  Goal,
  MilestoneStatus,
  GoalStatus,
  Priority,
  ExportFormat,
  calculateGoalProgress,
  formatGoalDuration,
  getGoalStatusColor,
  getPriorityColor
} from '../lib/goalTypes'
import { motion, AnimatePresence } from 'framer-motion'

interface GoalProfileDisplayProps {
  goals: Goal[]
  isExpanded: boolean
  onToggleExpand: () => void
  onExport: (format: ExportFormat) => void
  onEdit?: (goalId: string) => void
  onDelete?: (goalId: string) => void
  className?: string
}

interface GoalCardProps {
  goal: Goal
  isExpanded: boolean
  onEdit?: (goalId: string) => void
  onDelete?: (goalId: string) => void
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, isExpanded, onEdit, onDelete }) => {
  const progress = calculateGoalProgress(goal)
  const duration = formatGoalDuration(goal.startDate, goal.endDate)

  const statusColor = getGoalStatusColor(goal.status)
  const priorityColor = getPriorityColor(goal.priority)

  const completedMilestones = goal.milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length
  const totalMilestones = goal.milestones.length

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Card className={`bg-frosted-mint-900 border border-medium-jungle-200 hover:border-light-green-400 transition-all duration-300 ${isExpanded ? 'shadow-xl' : 'shadow-lg'}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start w-full">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-black-forest-500">{goal.title}</h3>
                <Badge
                  color={statusColor as any}
                  variant="flat"
                  className="text-xs uppercase tracking-wide"
                >
                  {goal.status}
                </Badge>
                <Chip
                  size="sm"
                  variant="flat"
                  className={`text-xs bg-${priorityColor}-100 text-${priorityColor}-700`}
                >
                  {goal.priority}
                </Chip>
              </div>

              {goal.description && (
                <p className="text-sm text-medium-jungle-600 line-clamp-2">
                  {goal.description}
                </p>
              )}
            </div>

            <div className="flex gap-2 ml-4">
              {onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-medium-jungle-500 hover:text-india-green-600"
                  onPress={() => onEdit(goal.id)}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                  onPress={() => onDelete(goal.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="w-full mt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-medium-jungle-600">Progress</span>
                <span className="text-xs font-semibold text-india-green-600">{progress.toFixed(1)}%</span>
              </div>
              <Progress
                value={progress}
                className="w-full"
                color="success"
                size="sm"
                classNames={{
                  track: "bg-frosted-mint-300",
                  indicator: "bg-gradient-to-r from-medium-jungle-500 to-light-green-500"
                }}
              />
            </div>
          )}
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Divider className="bg-medium-jungle-200" />

              <CardBody className="pt-4 space-y-6">
                {/* Goal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Timeline */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-black-forest-600 flex items-center gap-2">
                      📅 Timeline
                    </h4>
                    <div className="text-sm text-medium-jungle-600">
                      <div>Duration: {duration}</div>
                      <div>Started: {new Date(goal.startDate).toLocaleDateString()}</div>
                      {goal.endDate && (
                        <div>Target: {new Date(goal.endDate).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>

                  {/* Metrics */}
                  {(goal.targetValue || goal.unit) && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-black-forest-600 flex items-center gap-2">
                        🎯 Target
                      </h4>
                      <div className="text-sm text-medium-jungle-600">
                        {goal.targetValue && (
                          <div>Goal: {goal.targetValue} {goal.unit || 'units'}</div>
                        )}
                        <div>Current: {goal.currentValue || 0} {goal.unit || 'units'}</div>
                        {goal.targetValue && goal.currentValue && (
                          <div>Remaining: {goal.targetValue - (goal.currentValue || 0)} {goal.unit || 'units'}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Motivation */}
                {goal.motivation && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-black-forest-600 flex items-center gap-2">
                      💫 Motivation
                    </h4>
                    <p className="text-sm text-medium-jungle-600 bg-frosted-mint-500 p-3 rounded-lg border border-frosted-mint-400">
                      {goal.motivation}
                    </p>
                  </div>
                )}

                {/* Milestones */}
                {goal.milestones.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-semibold text-black-forest-600 flex items-center gap-2">
                        🎪 Milestones
                      </h4>
                      <span className="text-xs text-medium-jungle-500">
                        {completedMilestones}/{totalMilestones} completed
                      </span>
                    </div>

                    <div className="space-y-2">
                      {goal.milestones.map((milestone) => {
                        const isCompleted = milestone.status === MilestoneStatus.COMPLETED
                        const isInProgress = milestone.status === MilestoneStatus.IN_PROGRESS
                        const isOverdue = milestone.status === MilestoneStatus.OVERDUE

                        return (
                          <motion.div
                            key={milestone.id}
                            layout
                            className={`p-3 rounded-lg border transition-all duration-200 ${
                              isCompleted
                                ? 'bg-light-green-100 border-light-green-300 text-light-green-800'
                                : isInProgress
                                ? 'bg-india-green-100 border-india-green-300 text-india-green-800'
                                : isOverdue
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-frosted-mint-200 border-frosted-mint-400 text-medium-jungle-700'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <span className="text-lg mt-0.5">
                                  {isCompleted ? '✅' : isInProgress ? '🔄' : isOverdue ? '⚠️' : '⭕'}
                                </span>
                                <div className="flex-1">
                                  <div className="font-medium">{milestone.title}</div>
                                  {milestone.description && (
                                    <div className="text-xs opacity-80 mt-1">{milestone.description}</div>
                                  )}
                                  {milestone.dueDate && (
                                    <div className="text-xs opacity-70 mt-1">
                                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {milestone.progress > 0 && milestone.progress < 100 && (
                                <div className="text-xs font-semibold opacity-80">
                                  {milestone.progress}%
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Support System */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goal.accountability && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-black-forest-600 flex items-center gap-2">
                        🤝 Accountability
                      </h4>
                      <p className="text-sm text-medium-jungle-600 bg-frosted-mint-300 p-2 rounded">
                        {goal.accountability}
                      </p>
                    </div>
                  )}

                  {goal.reward && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-black-forest-600 flex items-center gap-2">
                        🎉 Reward
                      </h4>
                      <p className="text-sm text-medium-jungle-600 bg-frosted-mint-300 p-2 rounded">
                        {goal.reward}
                      </p>
                    </div>
                  )}
                </div>

                {/* Resources */}
                {goal.resources && goal.resources.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-black-forest-600 flex items-center gap-2">
                      📚 Resources
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {goal.resources.map((resource, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          variant="flat"
                          className="bg-medium-jungle-100 text-medium-jungle-700"
                        >
                          {resource}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}

                {/* Obstacles */}
                {goal.obstacles && goal.obstacles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-black-forest-600 flex items-center gap-2">
                      ⚠️ Anticipated Challenges
                    </h4>
                    <div className="space-y-1">
                      {goal.obstacles.map((obstacle, index) => (
                        <div
                          key={index}
                          className="text-sm text-medium-jungle-600 bg-frosted-mint-200 p-2 rounded border-l-2 border-india-green-400"
                        >
                          {obstacle}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {goal.tags && goal.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-black-forest-600 flex items-center gap-2">
                      🏷️ Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {goal.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          variant="bordered"
                          className="border-light-green-300 text-light-green-700 bg-light-green-50"
                        >
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reflection */}
                {goal.reflection && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-black-forest-600 flex items-center gap-2">
                      💭 Reflection
                    </h4>
                    <p className="text-sm text-medium-jungle-600 bg-frosted-mint-500 p-3 rounded-lg border border-frosted-mint-400 italic">
                      {goal.reflection}
                    </p>
                  </div>
                )}
              </CardBody>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

const GoalProfileDisplay: React.FC<GoalProfileDisplayProps> = ({
  goals,
  isExpanded,
  onToggleExpand,
  onExport,
  onEdit,
  onDelete,
  className = ""
}) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [exportFormat, setExportFormat] = useState<ExportFormat>(ExportFormat.MARKDOWN)

  const totalGoals = goals.length
  const activeGoals = goals.filter(g => g.status === GoalStatus.ACTIVE || g.status === GoalStatus.DRAFT).length
  const completedGoals = goals.filter(g => g.status === GoalStatus.COMPLETED).length
  const overallProgress = totalGoals > 0
    ? goals.reduce((sum, goal) => sum + calculateGoalProgress(goal), 0) / totalGoals
    : 0

  const handleExport = (format: ExportFormat) => {
    setExportFormat(format)
    onExport(format)
  }

  const handleSelectAll = () => {
    if (selectedGoals.length === goals.length) {
      setSelectedGoals([])
    } else {
      setSelectedGoals(goals.map(g => g.id))
    }
  }

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-4 ${className}`}>
      {/* Header */}
      <motion.div
        layout
        className="bg-gradient-to-r from-black-forest-500 to-medium-jungle-500 rounded-xl p-6 text-white shadow-lg"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">🎯 Goal Profile</h2>
            <p className="text-frosted-mint-200">Your personal roadmap to achievement</p>
          </div>

          <Button
            onPress={onToggleExpand}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            {isExpanded ? 'Collapse' : 'Expand'} Profile
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalGoals}</div>
            <div className="text-xs text-frosted-mint-300">Total Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-light-green-300">{activeGoals}</div>
            <div className="text-xs text-frosted-mint-300">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-india-green-300">{completedGoals}</div>
            <div className="text-xs text-frosted-mint-300">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-frosted-mint-300">{overallProgress.toFixed(0)}%</div>
            <div className="text-xs text-frosted-mint-300">Overall Progress</div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        {totalGoals > 0 && (
          <Progress
            value={overallProgress}
            className="w-full"
            color="success"
            size="md"
            classNames={{
              track: "bg-black-forest-600",
              indicator: "bg-gradient-to-r from-light-green-400 to-frosted-mint-300"
            }}
          />
        )}
      </motion.div>

      {/* Export Controls */}
      <AnimatePresence>
        {isExpanded && goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-frosted-mint-600 rounded-lg p-4 border border-medium-jungle-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-black-forest-600">Export Options:</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-medium-jungle-100 text-medium-jungle-700 hover:bg-medium-jungle-200"
                    onPress={() => handleExport(ExportFormat.MARKDOWN)}
                  >
                    📄 Markdown
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-medium-jungle-100 text-medium-jungle-700 hover:bg-medium-jungle-200"
                    onPress={() => handleExport(ExportFormat.JSON)}
                  >
                    📋 JSON
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-medium-jungle-100 text-medium-jungle-700 hover:bg-medium-jungle-200"
                    onPress={() => handleExport(ExportFormat.PDF)}
                  >
                    📑 PDF
                  </Button>
                </div>
              </div>

              <div className="text-xs text-medium-jungle-500">
                Generated on {new Date().toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals List */}
      {goals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-frosted-mint-700 rounded-xl border-2 border-dashed border-medium-jungle-300"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-medium-jungle-600 mb-2">No goals yet</h3>
          <p className="text-medium-jungle-500">Start a conversation with Machina to create your first goal!</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                isExpanded={isExpanded}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Footer */}
      <motion.div
        layout
        className="text-center py-4 text-xs text-medium-jungle-400"
      >
        Powered by Machina Goal Management System 🌟
      </motion.div>
    </div>
  )
}

export default GoalProfileDisplay