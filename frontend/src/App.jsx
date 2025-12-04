import { useState, useEffect } from 'react';
import TaskBoard from './components/TaskBoard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import VoiceInput from './components/VoiceInput';
import VoiceTaskReview from './components/VoiceTaskReview';
import SearchFilter from './components/SearchFilter';
import ThemeToggle from './components/ThemeToggle';
import LoadingAnimation from './components/LoadingAnimation';
import taskService from './services/taskService';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showVoiceReview, setShowVoiceReview] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [voiceData, setVoiceData] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Apply filters when tasks or filters change
  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTasks();
      setTasks(response.data || []);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      await loadTasks();
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task. Please try again.');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await taskService.updateTask(editingTask.id, taskData);
      await loadTasks();
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      await loadTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await taskService.updateTask(taskId, { ...task, status: newStatus });
        await loadTasks();
      }
    } catch (err) {
      console.error('Error moving task:', err);
      alert('Failed to update task status. Please try again.');
    }
  };

  const handleTaskClick = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleVoiceTranscript = async (transcript) => {
    try {
      const response = await taskService.parseVoiceTranscript(transcript);
      setVoiceData({
        transcript,
        parsed: response.data.parsed
      });
      setShowVoiceInput(false);
      setShowVoiceReview(true);
    } catch (err) {
      console.error('Error parsing transcript:', err);
      alert('Failed to parse voice input. Please try again.');
    }
  };

  const handleVoiceConfirm = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      await loadTasks();
      setShowVoiceReview(false);
      setVoiceData(null);
    } catch (err) {
      console.error('Error creating voice task:', err);
      alert('Failed to create task. Please try again.');
    }
  };

  const handleVoiceCancel = () => {
    setShowVoiceReview(false);
    setVoiceData(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      {/* Loading Animation */}
      <LoadingAnimation />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 transition-colors duration-300">
        {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg p-2.5 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">VoiceFlow - Voice Task Tracker</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Organize your tasks with the power of voice</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-lg p-1 shadow-inner border border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                    viewMode === 'kanban'
                      ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  <span>Kanban</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span>List</span>
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Task</span>
              </button>
              <button
                onClick={() => setShowVoiceInput(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
                <span>Voice Input</span>
              </button>
              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modals */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <TaskForm
                task={editingTask}
                mode={editingTask ? 'edit' : 'create'}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                onCancel={() => {
                  setShowTaskForm(false);
                  setEditingTask(null);
                }}
              />
            </div>
          </div>
        )}

        {showVoiceInput && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full relative">
              {/* Close Button - Top Right */}
              <button
                onClick={() => setShowVoiceInput(false)}
                className="absolute -top-3 -right-3 z-10 p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 shadow-lg transition-all duration-200 hover:scale-110 border-2 border-gray-200 dark:border-gray-600"
                title="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <VoiceInput onTranscriptReady={handleVoiceTranscript} />
            </div>
          </div>
        )}

        {showVoiceReview && voiceData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <VoiceTaskReview
                transcript={voiceData.transcript}
                parsedTask={voiceData.parsed}
                onConfirm={handleVoiceConfirm}
                onCancel={handleVoiceCancel}
              />
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <SearchFilter onFilterChange={handleFilterChange} initialFilters={filters} />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={loadTasks}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Tasks View */}
        {!loading && !error && (
          <>
            {viewMode === 'kanban' ? (
              <TaskBoard
                tasks={filteredTasks}
                onTaskMove={handleTaskMove}
                onTaskClick={handleTaskClick}
                onTaskDelete={handleDeleteTask}
              />
            ) : (
              <TaskList
                tasks={filteredTasks}
                onTaskClick={handleTaskClick}
                onTaskDelete={handleDeleteTask}
              />
            )}
          </>
        )}
      </main>
      </div>
    </>
  );
}

export default App;
