<template>
  <nav class="flex items-center justify-between px-6 py-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl mb-8 shadow-lg">
    <!-- Brand / Logo -->
    <div class="flex items-center gap-2">
      <!-- Glow Dot -->
      <span class="relative flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
      </span>
      <span class="text-sm font-bold tracking-wider text-slate-100 uppercase font-mono">Dev.Console</span>
    </div>

    <!-- Navigation links -->
    <div class="flex items-center gap-2">
      <router-link 
        :to="{ name: 'home' }" 
        class="px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300"
        exact-active-class="bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
        active-class=""
        class-binding="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      >
        Home
      </router-link>
      <router-link 
        :to="{ name: 'about' }" 
        class="px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300"
        exact-active-class="bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
        active-class=""
        class-binding="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      >
        About Me
      </router-link>
      <router-link 
        :to="{ name: 'federation' }" 
        class="px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300"
        exact-active-class="bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
        active-class=""
        class-binding="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      >
        Federation
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
/* Define a fallback default class for un-active router link since Tailwind classes take precedence */
a:not(.bg-indigo-600\/25) {
  color: #94a3b8;
}
a:not(.bg-indigo-600\/25):hover {
  color: #f1f5f9;
  background-color: rgba(30, 41, 59, 0.5);
}
</style>
