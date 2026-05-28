<script setup>
import { ref } from 'vue'

const activeConfigTab = ref('host')
const activeSection = ref('core')
const expandedFaq = ref(null)

const toggleFaq = (index) => {
  if (expandedFaq.value === index) {
    expandedFaq.value = null
  } else {
    expandedFaq.value = index
  }
}

const configs = {
  host: `// main/rspack.config.js (Host)
const { ModuleFederationPlugin } = require("@module-federation/enhanced/rspack");

module.exports = defineConfig((Meteor) => {
  return {
    ...(Meteor.isClient && {
      output: {
        uniqueName: "main",
      },
      plugins: [
        new ModuleFederationPlugin({
          name: "main",
          filename: "remoteEntry.js",
          remotes: {
            // Resolves the remote application entry points dynamically
            app1: "app1@http://localhost:4000/remoteEntry.js", 
          },
          shared: {
            vue: { singleton: true, requiredVersion: "^3.3.9" },
            "vue-router": { singleton: true, requiredVersion: "^4.2.5" }
          }
        })
      ]
    })
  };
});`,
  remote: `// app-1/rspack.config.js (Remote)
const { ModuleFederationPlugin } = require("@module-federation/enhanced/rspack");

module.exports = defineConfig((Meteor) => {
  return {
    ...(Meteor.isClient && {
      output: {
        uniqueName: "app1",
        // Crucial: remote must point to its asset host URL for correct bundle loading
        publicPath: process.env.PUBLIC_PATH || "http://localhost:8081/",
      },
      devServer: {
        headers: {
          // Allows host on port 3000 to fetch federated assets from port 8081
          "Access-Control-Allow-Origin": "*", 
        },
      },
      plugins: [
        new ModuleFederationPlugin({
          name: "app1",
          filename: "remoteEntry.js",
          exposes: {
            "./router": "./imports/ui/router.js", // Exposes the router config
          },
          shared: {
            vue: { singleton: true, requiredVersion: "^3.3.9", eager: true },
            "vue-router": { singleton: true, requiredVersion: "^4.2.5", eager: true }
          }
        })
      ]
    })
  };
});`,
  auth: `// app-1/imports/ui/utils/ddp.js
import { Meteor } from "meteor/meteor";
import { DDP } from "meteor/ddp-client";
import { Accounts } from "meteor/accounts-base";
import { Tracker } from "meteor/tracker";

export function getRemoteConnection(remoteName, defaultPort) {
  // 1. If loaded standalone, return local Meteor global connection
  if (typeof window !== "undefined" && window.location.port === String(defaultPort)) {
    return Meteor;
  }

  // 2. Establish connection to remote socket
  if (!connections[remoteName]) {
    const remoteUrl = Meteor.settings.public?.[\`\${remoteName}ServerUrl\`] 
      || \`http://localhost:\${defaultPort}\`;
    const conn = DDP.connect(remoteUrl);
    connections[remoteName] = conn;

    // 3. Reactively sync authentication credentials
    if (typeof window !== "undefined") {
      Tracker.autorun(() => {
        const isLoggingIn = Meteor.loggingIn();
        const userId = Meteor.userId();
        const token = Accounts._storedLoginToken();

        if (!isLoggingIn) {
          if (userId && token) {
            // Logs user into the remote DDP server automatically
            conn.call("login", { resume: token }, (err) => {
              if (err) console.error(\`Auth sync failed: \`, err);
            });
          } else {
            conn.call("logout");
          }
        }
      });
    }
  }
  return connections[remoteName];
}`
}

const faqs = [
  {
    q: "Why do we get CORS errors when the host loads remote bundles?",
    a: "Module Federation fetches JS chunks asynchronously using fetch/JSONP. Since the host runs on port 3000 and the remote assets are compiled on port 8081/4000, the browser blocks the cross-origin requests. To fix this, you must configure 'Access-Control-Allow-Origin': '*' headers in the remote's devServer settings inside rspack.config.js."
  },
  {
    q: "How does Vue-Router aggregate routes from remote modules?",
    a: "The remote app exposes its routes array directly. In main/imports/ui/router.js, we import this array asynchronously or synchronously as 'routes as remoteRoutes' from 'app1/router'. We map these routes, append a route namespace prefix like '/remote', and dynamically inject them into the host router's instance."
  },
  {
    q: "What is the difference between Rspack port 8081 and Meteor port 4000?",
    a: "Rspack devServer runs on port 8081 and is used purely to bundle and serve transient code changes (Hot Module Replacement) and Webpack chunks. The Meteor server itself runs on port 4000 (or 3001) and hosts the server logic, MongoDB connection, and serves physical files located in the 'public/' directory."
  },
  {
    q: "How do we prevent shared dependency version mismatches?",
    a: "We declare common dependencies like 'vue' and 'vue-router' as shared singletons inside the ModuleFederationPlugin config. By setting 'singleton: true', Module Federation ensures only a single instance of Vue is instantiated and shared in the browser window, avoiding library state conflicts."
  }
]
</script>

<template>
  <div class="federation-container max-w-6xl mx-auto px-4 py-8 text-slate-200 font-sans">
    <!-- Header banner -->
    <header class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-slate-800 p-8 md:p-12 mb-8 shadow-2xl">
      <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-10 -left-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="relative z-10">
        <div class="flex items-center gap-2 mb-4">
          <span class="px-3 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full font-mono uppercase tracking-wide">Developer Architecture Guide</span>
          <span class="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-mono uppercase tracking-wide">Federated</span>
        </div>
        <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
          Micro-Frontend Federation
        </h1>
        <p class="mt-3 text-slate-400 max-w-3xl leading-relaxed text-sm md:text-base">
          An in-depth analysis of how Meteor 3.x and Rspack collaborate using Module Federation, detailing data layers, credential synchronization, CORS configs, and asset routing pipelines.
        </p>
      </div>
    </header>

    <!-- Sub-navigation tabs for documentation topics -->
    <div class="flex border-b border-slate-800 p-1 bg-slate-950/40 rounded-xl max-w-xl mb-8">
      <button @click="activeSection = 'core'" 
              class="flex-1 py-2.5 text-center text-xs font-bold uppercase rounded-lg transition-all duration-300"
              :class="activeSection === 'core' ? 'bg-indigo-600/30 text-indigo-300 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'">
        Architecture Map
      </button>
      <button @click="activeSection = 'data'" 
              class="flex-1 py-2.5 text-center text-xs font-bold uppercase rounded-lg transition-all duration-300"
              :class="activeSection === 'data' ? 'bg-indigo-600/30 text-indigo-300 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'">
        Data & DDP Sync
      </button>
      <button @click="activeSection = 'assets'" 
              class="flex-1 py-2.5 text-center text-xs font-bold uppercase rounded-lg transition-all duration-300"
              :class="activeSection === 'assets' ? 'bg-indigo-600/30 text-indigo-300 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'">
        Assets & Troubleshooting
      </button>
    </div>

    <!-- MAIN SECTIONS -->
    <div class="transition-all duration-300">
      
      <!-- SECTION 1: Core Architecture Map -->
      <div v-if="activeSection === 'core'" class="space-y-8 animate-fadeIn">
        <section class="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-lg">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
            <span class="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
            Federation Pipeline Overview
          </h3>
          
          <!-- Interactive Diagram with styling -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative">
            
            <!-- Host Shell Card -->
            <div class="p-6 bg-slate-950/60 border border-slate-800/90 rounded-2xl flex flex-col justify-between hover:border-indigo-500/30 transition duration-300">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-[10px] font-bold font-mono text-indigo-400 uppercase tracking-widest">Host Application</span>
                  <span class="px-2 py-0.5 text-[10px] font-mono bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/20">Port 3000</span>
                </div>
                <h4 class="text-lg font-bold text-slate-100 mb-2">main (Shell)</h4>
                <p class="text-xs text-slate-400 leading-relaxed mb-4">
                  Acts as the master coordinator. Mounts Vue 3, configures Vue-Router, and loads remote components on-demand. Orchestrates authentication and global state hooks.
                </p>
                <ul class="space-y-2 text-xs text-slate-300">
                  <li class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    Imports `remoteEntry.js`
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    Registers unified Router routes
                  </li>
                </ul>
              </div>
              <div class="mt-6 pt-4 border-t border-slate-900 text-[11px] text-indigo-300 font-mono flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="5" y="5" rx="2" ry="2"></rect><path d="M5 9h14"></path><path d="M9 5v14"></path></svg>
                Primary Application Core
              </div>
            </div>

            <!-- Interlock Connective Bridge -->
            <div class="flex flex-col justify-center items-center py-6 lg:py-0 px-4">
              <div class="w-full max-w-xs space-y-4">
                <div class="flex items-center justify-center gap-1.5 text-slate-600">
                  <div class="h-0.5 bg-slate-800 flex-grow"></div>
                  <span class="text-[10px] uppercase tracking-wider font-bold text-slate-500">Binds at Runtime</span>
                  <div class="h-0.5 bg-slate-800 flex-grow"></div>
                </div>

                <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center space-y-2">
                  <span class="text-xs font-bold text-indigo-300 font-mono">ModuleFederationPlugin</span>
                  <p class="text-[11px] text-slate-400 leading-relaxed">
                    Rspack manages async module compilation. Shared scopes enforce a singleton instance of Vue.
                  </p>
                </div>

                <div class="flex items-center justify-center gap-1.5 text-slate-600">
                  <div class="h-0.5 bg-slate-800 flex-grow"></div>
                  <span class="text-[10px] uppercase tracking-wider font-bold text-slate-500">Connection Handshake</span>
                  <div class="h-0.5 bg-slate-800 flex-grow"></div>
                </div>
              </div>
            </div>

            <!-- Remote Micro-App Card -->
            <div class="p-6 bg-slate-950/60 border border-slate-800/90 rounded-2xl flex flex-col justify-between hover:border-emerald-500/30 transition duration-300">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-widest">Remote Micro-frontend</span>
                  <span class="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/20">Port 4000</span>
                </div>
                <h4 class="text-lg font-bold text-slate-100 mb-2">app-1 (Remote)</h4>
                <p class="text-xs text-slate-400 leading-relaxed mb-4">
                  Exposes routing paths, templates, logic models, and pages. Runs asynchronously from the host, compiling standalone or feeding the host dynamically.
                </p>
                <ul class="space-y-2 text-xs text-slate-300">
                  <li class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Exposes `./router` blueprint
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Runs devServer on port 8081
                  </li>
                </ul>
              </div>
              <div class="mt-6 pt-4 border-t border-slate-900 text-[11px] text-emerald-300 font-mono flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.886L5 8.912l4.886 1.912L12 17l1.912-6.176L19 8.912l-4.886-1.912z"></path></svg>
                Autonomous Build Endpoint
              </div>
            </div>

          </div>
        </section>

        <!-- Tech Stack Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl">
            <h4 class="font-bold text-slate-100 text-sm mb-3">Why Rspack for Meteor?</h4>
            <p class="text-xs text-slate-400 leading-relaxed">
              Meteor applications historically relied on internal build tools which compiled client assets progressively but could experience slowdowns in large codebases. Interfacing Meteor 3.x with **Rspack** (a Rust-based bundler compatible with Webpack) delivers lightning-fast compilation, HMR updates, and modern build-time loaders, keeping boot times near-instant.
            </p>
          </div>
          <div class="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl">
            <h4 class="font-bold text-slate-100 text-sm mb-3">Module Sharing Mechanism</h4>
            <p class="text-xs text-slate-400 leading-relaxed">
              When Module Federation initializes in the host (`main`), it creates a shared scope pool. When `app-1` requests a shared package (e.g. `vue`), Module Federation checks if the host has already loaded a compatible version. If yes, it loads the host's compiled Vue singleton instead of fetching a duplicate copy, drastically optimizing network payload size.
            </p>
          </div>
        </div>
      </div>

      <!-- SECTION 2: Data & DDP Sync Details -->
      <div v-if="activeSection === 'data'" class="space-y-6 animate-fadeIn">
        <div class="bg-slate-900/40 border border-slate-800/80 p-6 md:p-8 rounded-2xl">
          <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
            <span class="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
            Reactive DDP & Multi-App Authentication
          </h3>
          <p class="text-xs text-slate-400 leading-relaxed mb-6">
            Meteor's backend database communication works over DDP (Distributed Data Protocol), which uses standard WebSockets. When running a federated architecture, users login on the host (`port 3000`), but remote components inside `app-1` need to query database collections served by `app-1`'s server backend (`port 4000`).
          </p>

          <!-- DDP Auth Sync Step-by-Step -->
          <div class="relative pl-6 border-l border-indigo-500/30 space-y-6 ml-2">
            <div class="relative">
              <span class="absolute -left-[30px] top-0 w-4 h-4 bg-slate-950 border-2 border-indigo-400 rounded-full text-[9px] font-bold flex items-center justify-center text-indigo-400">1</span>
              <h5 class="text-xs font-bold text-slate-200">Host Login Detection</h5>
              <p class="text-[11px] text-slate-400 mt-1">
                The user inputs credentials on the host app. Meteor sets the authenticated user ID and saves the encrypted authentication token in the browser's local storage via standard Accounts machinery.
              </p>
            </div>
            <div class="relative">
              <span class="absolute -left-[30px] top-0 w-4 h-4 bg-slate-950 border-2 border-indigo-400 rounded-full text-[9px] font-bold flex items-center justify-center text-indigo-400">2</span>
              <h5 class="text-xs font-bold text-slate-200">DDP Socket Handshake</h5>
              <p class="text-[11px] text-slate-400 mt-1">
                The client code executes `DDP.connect("http://localhost:4000")` to open a secondary WebSocket connection targeting the remote app-1 database server.
              </p>
            </div>
            <div class="relative">
              <span class="absolute -left-[30px] top-0 w-4 h-4 bg-slate-950 border-2 border-indigo-400 rounded-full text-[9px] font-bold flex items-center justify-center text-indigo-400">3</span>
              <h5 class="text-xs font-bold text-slate-200">Token Synchronization & Resumption</h5>
              <p class="text-[11px] text-slate-400 mt-1">
                A reactive `Tracker.autorun` detects changes in the user's connection. It extracts the login token via `Accounts._storedLoginToken()` and logs the user into the remote DDP server using `conn.call("login", { resume: token })`.
              </p>
            </div>
            <div class="relative">
              <span class="absolute -left-[30px] top-0 w-4 h-4 bg-slate-950 border-2 border-indigo-400 rounded-full text-[9px] font-bold flex items-center justify-center text-indigo-400">4</span>
              <h5 class="text-xs font-bold text-slate-200">Authenticated CRUD Publications</h5>
              <p class="text-[11px] text-slate-400 mt-1">
                Once authenticated on the remote DDP server, the component can safely call publications (`conn.subscribe`) or invoke Meteor methods (`conn.callAsync`) on port 4000 while maintaining proper server-side security checks.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 3: Assets & Troubleshooting -->
      <div v-if="activeSection === 'assets'" class="space-y-6 animate-fadeIn">
        <div class="bg-slate-900/40 border border-slate-800/80 p-6 md:p-8 rounded-2xl">
          <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
            <span class="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
            Asset Routing & Port Redirection Pipelines
          </h3>
          <p class="text-xs text-slate-400 leading-relaxed mb-4">
            Static assets placed inside the remote's `public/` directory (such as `developer_avatar.png`) present a unique challenge when loaded on the host shell. Relative URLs like `/my_asset.png` automatically resolve against the current window host domain (`http://localhost:3000`), causing 404 errors.
          </p>
          
          <div class="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-4">
            <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">Dynamic Public Path Resolution</h4>
            <p class="text-xs text-slate-300 leading-relaxed">
              To address this without copy-pasting assets across micro-apps, we use a computed path resolution pattern:
            </p>
            <ol class="list-decimal pl-5 text-xs text-slate-400 space-y-2">
              <li>
                <strong>Detect Bundler Context:</strong> We inspect `__webpack_public_path__` at runtime. Inside a federated chunk, Rspack sets this to the remote devServer host (`http://localhost:8081/`).
              </li>
              <li>
                <strong>Map Port to Static Host:</strong> Since the devServer (8081) only compiles JS chunks, we replace `localhost:8081` with the Meteor asset host (`localhost:4000`) dynamically.
              </li>
              <li>
                <strong>Fallback chain:</strong> If running standalone, we default to the local root `/`. If running in production docker, we query `Meteor.settings.public.remoteServerUrl`.
              </li>
            </ol>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl">
          <h3 class="text-lg font-bold mb-4">Federation Q&A Troubleshooting</h3>
          <div class="space-y-3">
            <div v-for="(faq, index) in faqs" :key="index" class="border border-slate-800 rounded-xl overflow-hidden">
              <button @click="toggleFaq(index)" 
                      class="w-full text-left px-5 py-4 bg-slate-950/40 hover:bg-slate-900/30 flex justify-between items-center transition-colors">
                <span class="text-xs font-bold text-slate-200">{{ faq.q }}</span>
                <!-- Chevron -->
                <span class="text-slate-500 transform transition-transform duration-300" :class="expandedFaq === index ? 'rotate-180' : ''">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </button>
              <div v-if="expandedFaq === index" class="px-5 py-4 bg-slate-950/20 text-xs text-slate-400 leading-relaxed border-t border-slate-900/80 animate-fadeIn">
                {{ faq.a }}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- CODE SNIPPET AREA -->
    <section class="mt-8">
      <!-- Config Code Editor -->
      <div class="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl font-mono text-xs">
        <!-- Editor header -->
        <div class="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-red-500/70 inline-block"></span>
            <span class="w-3 h-3 rounded-full bg-yellow-500/70 inline-block"></span>
            <span class="w-3 h-3 rounded-full bg-green-500/70 inline-block"></span>
          </div>
          <span class="text-slate-400 text-[10px] font-bold">Federation Configuration Blueprints</span>
          <span class="w-3"></span>
        </div>

        <!-- Code selection tabs -->
        <div class="flex bg-slate-900/30 border-b border-slate-900/80">
          <button @click="activeConfigTab = 'host'" 
                  class="px-4 py-2.5 text-[10px] font-bold uppercase transition duration-300 border-r border-slate-900"
                  :class="activeConfigTab === 'host' ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-b-indigo-500' : 'text-slate-500 hover:text-slate-300 bg-slate-950/20'">
            Host Rspack Config
          </button>
          <button @click="activeConfigTab = 'remote'" 
                  class="px-4 py-2.5 text-[10px] font-bold uppercase transition duration-300 border-r border-slate-900"
                  :class="activeConfigTab === 'remote' ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-b-indigo-500' : 'text-slate-500 hover:text-slate-300 bg-slate-950/20'">
            Remote Rspack Config
          </button>
          <button @click="activeConfigTab = 'auth'" 
                  class="px-4 py-2.5 text-[10px] font-bold uppercase transition duration-300"
                  :class="activeConfigTab === 'auth' ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-b-indigo-500' : 'text-slate-500 hover:text-slate-300 bg-slate-950/20'">
            Reactive DDP Auth Sync
          </button>
        </div>

        <!-- Editor output content -->
        <div class="p-5 overflow-x-auto h-[350px] bg-slate-950/80">
          <pre class="text-indigo-200/90 leading-relaxed text-[11px]">{{ configs[activeConfigTab] }}</pre>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.federation-container {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
