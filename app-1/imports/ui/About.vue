<script setup>
import { ref, onMounted, computed } from 'vue'
import { Meteor } from 'meteor/meteor'

// Dynamic resolution of the remote's static asset URL
const avatarUrl = computed(() => {
  // 1. Try to resolve via Webpack/Rspack's dynamic public path
  try {
    if (typeof __webpack_public_path__ !== 'undefined' && __webpack_public_path__) {
      let base = __webpack_public_path__.endsWith('/') ? __webpack_public_path__ : __webpack_public_path__ + '/';
      // Rspack devServer (port 8081) only compiles JS/CSS assets.
      // Static public assets are served by the Meteor web server (port 4000).
      if (base.includes('localhost:8081')) {
        base = base.replace('localhost:8081', 'localhost:4000');
      }
      return `${base}developer_avatar.png`;
    }
  } catch (e) {
    // Ignore if __webpack_public_path__ is not defined
  }

  // 2. Try to resolve via Meteor Settings configured in the environment
  try {
    const app1Url = Meteor.settings?.public?.remoteServerUrl || Meteor.settings?.public?.app1ServerUrl;
    if (app1Url) {
      const base = app1Url.endsWith('/') ? app1Url : app1Url + '/';
      return `${base}developer_avatar.png`;
    }
  } catch (e) {
    // Ignore
  }

  // 3. Fall back to relative path if loaded standalone
  return '/developer_avatar.png';
})

// Interactive states
const activeTab = ref('overview')
const clapsCount = ref(128)
const hasClapped = ref(false)
const showNotification = ref(false)
const terminalInput = ref('')
const terminalHistory = ref([
  { type: 'input', text: 'whoami' },
  { type: 'output', text: 'Name: Alex Rivera\nRole: Senior Full-Stack Engineer\nFocus: Interactive Web Applications, Node.js, and Meteor ecosystems\nStatus: Coding next-gen UI/UX architectures.' }
])

// Skills definitions
const skillCategories = [
  {
    name: 'Frontend Core',
    skills: [
      { name: 'Vue 3 / Composition API', level: 95 },
      { name: 'Tailwind CSS / PostCSS', level: 90 },
      { name: 'Vite / Rspack / Build Tools', level: 85 },
      { name: 'TypeScript / Modern ES', level: 88 }
    ]
  },
  {
    name: 'Backend & Data',
    skills: [
      { name: 'Node.js / Express / Fastify', level: 92 },
      { name: 'Meteor JS Framework', level: 85 },
      { name: 'MongoDB / Redis / Mongoose', level: 87 },
      { name: 'GraphQL / REST APIs', level: 89 }
    ]
  },
  {
    name: 'DevOps & Systems',
    skills: [
      { name: 'Docker / Containerization', level: 80 },
      { name: 'CI/CD (GitHub Actions / GitLab)', level: 82 },
      { name: 'AWS / Vercel / DigitalOcean', level: 78 },
      { name: 'Git & Monorepo Workflows', level: 90 }
    ]
  }
]

// Timeline definitions
const milestones = [
  {
    year: '2024 - Present',
    title: 'Senior Frontend Architect',
    company: 'PixelForge Studio',
    desc: 'Leading engineering on design system frameworks and modular frontend architectures. Migrated legacy apps to Vue 3 and modern build toolchains.'
  },
  {
    year: '2021 - 2024',
    title: 'Full Stack Engineer',
    company: 'Synergy Corp',
    desc: 'Developed scalable real-time microservices using Meteor, Node.js, and MongoDB. Optimized database queries and improved page load times by 40%.'
  },
  {
    year: '2019 - 2021',
    title: 'UI/UX Developer',
    company: 'Aura Interactive',
    desc: 'Created highly interactive user interfaces and smooth motion experiences. Built reusable Vue component libraries and state containers.'
  }
]

// Project Showcase (mini cards)
const favoriteProjects = [
  {
    name: 'Stellar Dash',
    desc: 'Real-time monitoring panel with custom widget configuration and high-frequency WebSocket streams.',
    tags: ['Vue 3', 'Tailwind', 'WebSockets', 'ChartJS']
  },
  {
    name: 'Pulse DB Client',
    desc: 'A minimalist, lightning-fast web UI client for debugging reactive MongoDB collections.',
    tags: ['Meteor', 'MongoDB', 'Tailwind', 'Vuex']
  }
]

// Contact form reactive state
const contactForm = ref({
  name: '',
  email: '',
  message: ''
})
const formSubmitted = ref(false)

// Methods
const handleClap = () => {
  if (!hasClapped.value) {
    clapsCount.value++
    hasClapped.value = true
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  }
}

const submitContact = (e) => {
  e.preventDefault()
  if (contactForm.value.name && contactForm.value.email && contactForm.value.message) {
    formSubmitted.value = true
    // Simulate sending API request
    setTimeout(() => {
      contactForm.value = { name: '', email: '', message: '' }
    }, 2000)
  }
}

const runTerminalCommand = (cmdText = null) => {
  const query = cmdText !== null ? cmdText.trim() : terminalInput.value.trim()
  if (!query) return

  terminalHistory.value.push({ type: 'input', text: query })

  let output = ''
  switch (query.toLowerCase()) {
    case 'help':
      output = 'Available commands: whoami, skills, timeline, contact, clear'
      break
    case 'whoami':
      output = 'Name: Alex Rivera\nRole: Senior Full-Stack Engineer\nStatus: Online'
      break
    case 'skills':
      output = 'Core: Vue 3, Node.js, Tailwind, Meteor, MongoDB'
      break
    case 'timeline':
      output = '2024: PixelForge Studio (Senior UI)\n2021: Synergy Corp (Full Stack)\n2019: Aura Interactive'
      break
    case 'contact':
      output = 'Email: alex.rivera.dev@example.com\nGitHub: github.com/alexriveradev'
      break
    case 'clear':
      terminalHistory.value = []
      terminalInput.value = ''
      return
    default:
      output = `Command not found: '${query}'. Type 'help' for options.`
  }

  terminalHistory.value.push({ type: 'output', text: output })
  terminalInput.value = ''
}
</script>

<template>
  <div class="about-container max-w-6xl mx-auto px-4 py-8 text-slate-100">
    <!-- Header Hero Section with glassmorphism -->
    <header class="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-700/50 p-8 md:p-12 mb-8 shadow-2xl backdrop-blur-md">
      <!-- Background neon glows -->
      <div class="absolute -top-16 -left-16 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-16 -right-16 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex flex-col md:flex-row items-center gap-8 relative z-10">
        <!-- Avatar Wrapper with pulsing border -->
        <div class="relative group">
          <div class="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <div class="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-950">
            <img :src="avatarUrl" alt="Developer Avatar" class="w-full h-full object-cover object-center transform hover:scale-110 transition duration-500" />
          </div>
          <!-- Online status badge -->
          <div class="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center" title="Available for projects">
            <span class="absolute w-full h-full bg-emerald-400 rounded-full opacity-75 animate-ping"></span>
          </div>
        </div>

        <!-- Hero text info -->
        <div class="text-center md:text-left flex-1">
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
            <span class="px-3 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">Senior Developer</span>
            <span class="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">Available</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            Alex Rivera
          </h1>
          <p class="mt-2 text-lg text-indigo-200 font-medium font-sans">
            Crafting elegant code & interactive digital experiences.
          </p>
          <p class="mt-4 text-slate-400 max-w-2xl leading-relaxed text-sm md:text-base">
            I'm a full-stack developer who loves bridge-building between engineering and visual design. I design, architect, and deliver robust software solutions using modern JavaScript technologies, with a strong focus on real-time features and responsive systems.
          </p>

          <!-- Interactive Social Buttons / Counter -->
          <div class="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <a href="https://github.com" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 hover:border-slate-600 rounded-xl text-slate-200 text-sm transition-all duration-300 hover:-translate-y-0.5">
              <!-- Github Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 hover:border-slate-600 rounded-xl text-slate-200 text-sm transition-all duration-300 hover:-translate-y-0.5">
              <!-- LinkedIn Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              LinkedIn
            </a>
            <button @click="handleClap" class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-300"
                    :class="hasClapped ? 'bg-indigo-600/35 border-indigo-500/50 text-indigo-200' : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700/80 hover:border-slate-600 text-slate-300 hover:-translate-y-0.5'">
              <!-- Sparkles/Claps Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-yellow-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.886L5 8.912l4.886 1.912L12 17l1.912-6.176L19 8.912l-4.886-1.912z"></path><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z"></path><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"></path></svg>
              <span>{{ clapsCount }} Claps</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Notification Toast -->
    <Transition name="fade">
      <div v-if="showNotification" class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-slate-900 border-2 border-indigo-500/80 text-white rounded-xl shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span class="text-sm font-medium">Thank you for your support! 🚀</span>
      </div>
    </Transition>

    <!-- Content Grid: Tabs and Terminal -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content Tabs (Left 2 cols on wide screen) -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Navigation Tabs -->
        <div class="flex border-b border-slate-800 p-1 bg-slate-950/40 rounded-xl max-w-md">
          <button @click="activeTab = 'overview'" 
                  class="flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all duration-300"
                  :class="activeTab === 'overview' ? 'bg-indigo-600/30 text-indigo-300 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'">
            Overview
          </button>
          <button @click="activeTab = 'skills'" 
                  class="flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all duration-300"
                  :class="activeTab === 'skills' ? 'bg-indigo-600/30 text-indigo-300 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'">
            Skills Matrix
          </button>
          <button @click="activeTab = 'experience'" 
                  class="flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all duration-300"
                  :class="activeTab === 'experience' ? 'bg-indigo-600/30 text-indigo-300 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'">
            Experience
          </button>
        </div>

        <!-- Tab contents with nice enter transition -->
        <div class="transition-all duration-300">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6 animate-fadeIn">
            <!-- Summary card -->
            <div class="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl">
              <h3 class="text-xl font-bold text-slate-100 flex items-center gap-2 mb-4">
                <span class="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                About Me Overview
              </h3>
              <p class="text-slate-300 leading-relaxed text-sm md:text-base">
                I spend my days architecting interactive UI components and ensuring that database queries, API endpoints, and web applications run optimally. I value clean code structure, modern bundling pipelines, and creating user interfaces that feel alive through smooth transitions and deliberate aesthetics.
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div class="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl">
                  <h4 class="text-indigo-400 font-semibold text-sm mb-1">Architecture Philosophy</h4>
                  <p class="text-xs text-slate-400">Keep code declarative, keep state close to where it is used, and structure component hierarchy cleanly.</p>
                </div>
                <div class="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl">
                  <h4 class="text-emerald-400 font-semibold text-sm mb-1">Current Dev Stack</h4>
                  <p class="text-xs text-slate-400">Vue 3 setup, Rspack/Vite bundlers, Tailwind, Node backend architecture, and reactive MongoDB feeds.</p>
                </div>
              </div>
            </div>

            <!-- Project spotlight card -->
            <div class="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl">
              <h3 class="text-xl font-bold text-slate-100 flex items-center gap-2 mb-4">
                <span class="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                Recent Spotlights
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="proj in favoriteProjects" :key="proj.name" class="p-4 bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-xl transition-all duration-300 hover:translate-x-1 group">
                  <div class="flex justify-between items-start mb-2">
                    <span class="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{{ proj.name }}</span>
                    <!-- Arrow icon -->
                    <span class="opacity-0 group-hover:opacity-100 text-indigo-400 transition duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                  </div>
                  <p class="text-xs text-slate-400 mb-3 leading-relaxed">{{ proj.desc }}</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="tag in proj.tags" :key="tag" class="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700/60">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Skills Matrix Tab -->
          <div v-if="activeTab === 'skills'" class="space-y-6 animate-fadeIn">
            <div class="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl">
              <h3 class="text-xl font-bold text-slate-100 flex items-center gap-2 mb-6">
                <span class="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                Skills Matrix & Expertise
              </h3>

              <div class="space-y-6">
                <div v-for="cat in skillCategories" :key="cat.name" class="border border-slate-800/50 p-4 bg-slate-950/30 rounded-xl">
                  <h4 class="text-sm font-semibold text-indigo-300 mb-4 tracking-wider uppercase">{{ cat.name }}</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="skill in cat.skills" :key="skill.name" class="space-y-1.5">
                      <div class="flex justify-between items-center text-xs">
                        <span class="text-slate-300 font-medium">{{ skill.name }}</span>
                        <span class="text-slate-500 font-mono">{{ skill.level }}%</span>
                      </div>
                      <!-- Animated Skill Bar -->
                      <div class="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-1000"
                             :style="{ width: `${skill.level}%` }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Experience Tab -->
          <div v-if="activeTab === 'experience'" class="space-y-6 animate-fadeIn">
            <div class="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl">
              <h3 class="text-xl font-bold text-slate-100 flex items-center gap-2 mb-6">
                <span class="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                Timeline / Professional History
              </h3>

              <div class="relative pl-6 border-l border-slate-800 space-y-8 ml-2">
                <div v-for="(milestone, idx) in milestones" :key="milestone.title" class="relative group">
                  <!-- Timeline indicator dot -->
                  <div class="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border-4 border-slate-900 bg-indigo-500 group-hover:bg-emerald-500 transition-colors duration-300"></div>
                  
                  <div>
                    <span class="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">
                      {{ milestone.year }}
                    </span>
                    <h4 class="text-md font-bold text-slate-200">
                      {{ milestone.title }} <span class="text-slate-500 font-medium">@ {{ milestone.company }}</span>
                    </h4>
                    <p class="text-xs text-slate-400 mt-2 leading-relaxed">
                      {{ milestone.desc }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Section (Right 1 col on wide screen) -->
      <div class="space-y-6">
        <!-- Interactive Terminal Simulator Card -->
        <div class="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl font-mono text-xs">
          <!-- Terminal top bar -->
          <div class="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
            </div>
            <span class="text-slate-500 text-[10px]">zsh - profile_terminal</span>
            <span class="w-3"></span>
          </div>

          <!-- Terminal content -->
          <div class="p-4 space-y-3 h-64 overflow-y-auto bg-slate-950/90">
            <div class="text-slate-500 text-[10px]">Tip: Type 'help' or click links below</div>
            <div v-for="(log, i) in terminalHistory" :key="i" class="space-y-1">
              <div v-if="log.type === 'input'" class="text-indigo-400 flex items-center">
                <span class="text-slate-600 mr-1.5">$</span>
                <span>{{ log.text }}</span>
              </div>
              <div v-else class="text-slate-300 whitespace-pre-line leading-relaxed pb-1 border-b border-slate-900/60">
                {{ log.text }}
              </div>
            </div>

            <!-- Input area -->
            <div class="flex items-center text-slate-300">
              <span class="text-slate-600 mr-1.5">$</span>
              <input v-model="terminalInput" 
                     @keydown.enter="runTerminalCommand()" 
                     type="text" 
                     placeholder="Type command..." 
                     class="bg-transparent border-none outline-none flex-1 text-indigo-300 focus:ring-0 p-0 text-xs font-mono" />
            </div>
          </div>

          <!-- Clickable shortcuts for ease of use -->
          <div class="p-3 bg-slate-900/50 border-t border-slate-800 flex flex-wrap gap-2 justify-center">
            <button @click="runTerminalCommand('skills')" class="px-2 py-1 bg-slate-800/80 hover:bg-indigo-900/40 text-slate-400 hover:text-indigo-300 border border-slate-700/60 rounded text-[10px] transition duration-200">
              $ skills
            </button>
            <button @click="runTerminalCommand('timeline')" class="px-2 py-1 bg-slate-800/80 hover:bg-indigo-900/40 text-slate-400 hover:text-indigo-300 border border-slate-700/60 rounded text-[10px] transition duration-200">
              $ timeline
            </button>
            <button @click="runTerminalCommand('contact')" class="px-2 py-1 bg-slate-800/80 hover:bg-indigo-900/40 text-slate-400 hover:text-indigo-300 border border-slate-700/60 rounded text-[10px] transition duration-200">
              $ contact
            </button>
            <button @click="runTerminalCommand('clear')" class="px-2 py-1 bg-slate-800/80 hover:bg-red-950/20 text-slate-500 hover:text-red-400 border border-slate-700/40 rounded text-[10px] transition duration-200">
              $ clear
            </button>
          </div>
        </div>

        <!-- Simulated Quick Contact Card -->
        <div class="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl shadow-xl">
          <h3 class="text-md font-bold text-slate-100 flex items-center gap-2 mb-4">
            <span class="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
            Send a Quick Note
          </h3>

          <form v-if="!formSubmitted" @submit="submitContact" class="space-y-3.5">
            <div>
              <label class="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Name</label>
              <input v-model="contactForm.name" type="text" required
                     class="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors"
                     placeholder="Your name" />
            </div>
            <div>
              <label class="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Email</label>
              <input v-model="contactForm.email" type="email" required
                     class="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors"
                     placeholder="your@email.com" />
            </div>
            <div>
              <label class="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Message</label>
              <textarea v-model="contactForm.message" required rows="3"
                        class="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors resize-none"
                        placeholder="Say hello..."></textarea>
            </div>
            <button type="submit" 
                    class="w-full py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border border-indigo-500/30 text-white rounded-lg text-xs font-semibold shadow-md transition-all duration-300 hover:shadow-indigo-500/10">
              Send Message
            </button>
          </form>

          <!-- Submit Success State -->
          <div v-else class="text-center py-6 space-y-3 animate-fadeIn">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <!-- Check icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h4 class="text-sm font-bold text-slate-200">Message Sent Successfully!</h4>
            <p class="text-xs text-slate-400 leading-relaxed px-4">
              Thank you for reaching out. Your simulated message has been captured.
            </p>
            <button @click="formSubmitted = false" class="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold mt-2 block mx-auto">
              Send another note
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

.about-container {
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Animations */
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

.animate-fadeIn {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
