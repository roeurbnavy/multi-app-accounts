<script setup>
import { ref, computed, onMounted } from 'vue'
import { getRemoteConnection } from './utils/ddp'

// Establish remote DDP connection pointing to app-1's Meteor backend
const connection = getRemoteConnection("app1", 4000);

const todos = ref([])
const newTodoText = ref('')
const filter = ref('all')
const loading = ref(true)

// Detect if we are loading inside the host app or standalone
const isStandalone = computed(() => {
  if (typeof window === 'undefined') return true;
  return window.location.port === '4000';
})

// Fetch todos using the connection instance
const fetchTodos = async () => {
  try {
    const list = await connection.callAsync('api/todos/find')
    todos.value = list
  } catch (error) {
    console.error('Error fetching todos:', error)
  } finally {
    loading.value = false
  }
}

// Add new todo (with optimistic UI update)
const addTodo = async () => {
  const text = newTodoText.value.trim()
  if (!text) return
  
  const tempId = Math.random().toString()
  todos.value.unshift({
    _id: tempId,
    text,
    checked: false,
    createdAt: new Date(),
    optimistic: true
  })
  newTodoText.value = ''

  try {
    await connection.callAsync('api/todos/insert', text)
    await fetchTodos()
  } catch (error) {
    console.error('Error adding todo:', error)
    // Rollback
    todos.value = todos.value.filter(t => t._id !== tempId)
  }
}

// Toggle checked state (with optimistic UI update)
const toggleTodo = async (todo) => {
  const originalChecked = todo.checked
  todo.checked = !todo.checked

  try {
    await connection.callAsync('api/todos/toggle', todo._id)
    await fetchTodos()
  } catch (error) {
    console.error('Error toggling todo:', error)
    // Rollback
    todo.checked = originalChecked
  }
}

// Remove todo (with optimistic UI update)
const removeTodo = async (id) => {
  const backup = [...todos.value]
  todos.value = todos.value.filter(t => t._id !== id)

  try {
    await connection.callAsync('api/todos/remove', id)
    await fetchTodos()
  } catch (error) {
    console.error('Error removing todo:', error)
    // Rollback
    todos.value = backup
  }
}

// Clear completed todos (with optimistic UI update)
const clearCompleted = async () => {
  const backup = [...todos.value]
  todos.value = todos.value.filter(t => !t.checked)

  try {
    await connection.callAsync('api/todos/clearCompleted')
    await fetchTodos()
  } catch (error) {
    console.error('Error clearing completed:', error)
    todos.value = backup
  }
}

// Stats computations
const totalCount = computed(() => todos.value.length)
const activeCount = computed(() => todos.value.filter(t => !t.checked).length)
const completedCount = computed(() => todos.value.filter(t => t.checked).length)
const completionPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

// Filtered list computed
const filteredTodos = computed(() => {
  if (filter.value === 'active') {
    return todos.value.filter(t => !t.checked)
  } else if (filter.value === 'completed') {
    return todos.value.filter(t => t.checked)
  }
  return todos.value
})

onMounted(() => {
  fetchTodos()
})
</script>

<template>
  <div class="todos-container max-w-6xl mx-auto px-4 py-8 text-slate-200 font-sans">
    <!-- Header banner block with premium gradients and glows -->
    <header class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-slate-800 p-8 md:p-10 mb-8 shadow-2xl">
      <div class="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-10 -left-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="px-3 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full font-mono uppercase tracking-wide">Developer Workspace</span>
            
            <!-- Connection indicator -->
            <span v-if="isStandalone" class="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-mono uppercase tracking-wide flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              Standalone (Port 4000)
            </span>
            <span v-else class="px-3 py-1 text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full font-mono uppercase tracking-wide flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse"></span>
              Federated (Port 3000 -> 4000)
            </span>
          </div>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            Task Management Dashboard
          </h1>
          <p class="mt-2 text-slate-400 max-w-xl leading-relaxed text-xs md:text-sm">
            Reactive workspace tasks synced dynamically over Meteor DDP. Optimistic updates deliver near-instant interaction response times.
          </p>
        </div>

        <!-- Progress Tracker widget -->
        <div class="bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl min-w-[200px] flex flex-col justify-center">
          <div class="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
            <span>Overall Progress</span>
            <span class="text-indigo-400 font-mono">{{ completionPercentage }}%</span>
          </div>
          <!-- Progress bar -->
          <div class="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div class="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500" :style="{ width: `${completionPercentage}%` }"></div>
          </div>
          <div class="flex justify-between items-center text-[10px] text-slate-500 mt-2 font-mono">
            <span>{{ completedCount }} Done</span>
            <span>{{ activeCount }} Active</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Workspace Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <!-- Left Column: Input Form and Controls -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md">
          <h3 class="text-md font-bold mb-4 flex items-center gap-2">
            <span class="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
            Add Workspace Task
          </h3>
          
          <form @submit.prevent="addTodo" class="space-y-4">
            <div>
              <label class="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Task Description</label>
              <textarea 
                v-model="newTodoText" 
                rows="3" 
                required
                placeholder="What needs to be done? e.g. Configure Tailwind namespace prefix..."
                class="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors resize-none leading-relaxed"
              ></textarea>
            </div>
            <button 
              type="submit" 
              class="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border border-indigo-500/30 text-white rounded-xl text-xs font-semibold shadow-md transition-all duration-300 hover:shadow-indigo-500/10 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
              Add New Task
            </button>
          </form>
        </div>

        <!-- Shortcut stats -->
        <div class="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Task Breakdown</h4>
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
              <div class="text-xl font-bold font-mono text-indigo-400">{{ totalCount }}</div>
              <div class="text-[9px] uppercase font-semibold text-slate-500 mt-1">Total</div>
            </div>
            <div class="p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
              <div class="text-xl font-bold font-mono text-emerald-400">{{ completedCount }}</div>
              <div class="text-[9px] uppercase font-semibold text-slate-500 mt-1">Done</div>
            </div>
            <div class="p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
              <div class="text-xl font-bold font-mono text-amber-400">{{ activeCount }}</div>
              <div class="text-[9px] uppercase font-semibold text-slate-500 mt-1">Pending</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Task List -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Controls Filter bar -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
          <div class="flex bg-slate-950 border border-slate-800 p-1 rounded-xl gap-1 max-w-[280px]">
            <button 
              @click="filter = 'all'" 
              class="flex-1 px-4 py-1.5 text-center text-[10px] font-bold uppercase rounded-lg transition-all duration-300"
              :class="filter === 'all' ? 'bg-indigo-600/30 text-indigo-300 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'"
            >
              All
            </button>
            <button 
              @click="filter = 'active'" 
              class="flex-1 px-4 py-1.5 text-center text-[10px] font-bold uppercase rounded-lg transition-all duration-300"
              :class="filter === 'active' ? 'bg-indigo-600/30 text-indigo-300 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'"
            >
              Active
            </button>
            <button 
              @click="filter = 'completed'" 
              class="flex-1 px-4 py-1.5 text-center text-[10px] font-bold uppercase rounded-lg transition-all duration-300"
              :class="filter === 'completed' ? 'bg-indigo-600/30 text-indigo-300 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'"
            >
              Done
            </button>
          </div>

          <!-- Clear completed option -->
          <button 
            v-if="completedCount > 0"
            @click="clearCompleted" 
            class="px-4 py-2 hover:bg-red-950/20 text-red-400 hover:text-red-300 border border-red-900/30 hover:border-red-900/50 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Clear Completed
          </button>
        </div>

        <!-- Task List Area -->
        <div class="relative min-h-[250px] bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
          <!-- Loading skeleton -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-12 space-y-4">
            <div class="w-8 h-8 rounded-full border-2 border-slate-700 border-t-indigo-500 animate-spin"></div>
            <span class="text-xs text-slate-500 font-mono">Synchronizing database...</span>
          </div>

          <!-- Empty list state -->
          <div v-else-if="filteredTodos.length === 0" class="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider">No Tasks Found</h4>
              <p class="text-[11px] text-slate-500 mt-1 max-w-[240px] leading-relaxed">
                There are no tasks matching your active filter. Add a task to populate this view.
              </p>
            </div>
          </div>

          <!-- Animated todo list -->
          <ul v-else class="space-y-3.5">
            <TransitionGroup name="todo-list">
              <li 
                v-for="todo in filteredTodos" 
                :key="todo._id"
                class="group p-4 bg-slate-950/60 hover:bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(99,102,241,0.05)]"
                :class="{ 'opacity-60': todo.checked, 'border-indigo-900/30': todo.optimistic }"
              >
                <div class="flex items-center gap-3.5 flex-1 min-w-0">
                  <!-- Custom styled checkbox button -->
                  <button 
                    @click="toggleTodo(todo)" 
                    class="w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0"
                    :class="todo.checked ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-700 hover:border-indigo-400 text-transparent'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </button>

                  <!-- Todo Text -->
                  <span 
                    class="text-xs md:text-sm font-medium leading-relaxed truncate-3-lines flex-1 transition-all duration-300"
                    :class="todo.checked ? 'line-through text-slate-500' : 'text-slate-200'"
                  >
                    {{ todo.text }}
                  </span>
                </div>

                <!-- Delete Action -->
                <button 
                  @click="removeTodo(todo._id)"
                  class="opacity-0 group-hover:opacity-100 p-2 bg-slate-900 hover:bg-red-950/30 border border-slate-800 hover:border-red-900/20 text-slate-500 hover:text-red-400 rounded-xl transition-all duration-300 flex-shrink-0"
                  title="Delete Task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </li>
            </TransitionGroup>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

.todos-container {
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Custom Multiline Truncation */
.truncate-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

/* Transition Group Animations for Todos */
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.todo-list-enter-from {
  opacity: 0;
  transform: translateX(-15px);
}

.todo-list-leave-to {
  opacity: 0;
  transform: translateX(15px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
