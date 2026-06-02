<script setup>
import { ref } from "vue";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

const isLogin = ref(true);
const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMsg = ref("");
const isLoading = ref(false);

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  errorMsg.value = "";
  username.value = "";
  password.value = "";
  confirmPassword.value = "";
};

const handleSubmit = () => {
  errorMsg.value = "";

  if (!username.value || !password.value) {
    errorMsg.value = "All fields are required";
    return;
  }

  if (!isLogin.value && password.value !== confirmPassword.value) {
    errorMsg.value = "Passwords do not match";
    return;
  }

  isLoading.value = true;

  if (isLogin.value) {
    // Log in
    Meteor.loginWithPassword(username.value, password.value, (err) => {
      isLoading.value = false;
      if (err) {
        errorMsg.value = err.reason || "Failed to log in";
      }
    });
  } else {
    // Register
    Accounts.createUser(
      {
        username: username.value,
        password: password.value,
      },
      (err) => {
        isLoading.value = false;
        if (err) {
          errorMsg.value = err.reason || "Failed to register";
        }
      },
    );
  }
};
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-[#0d0e12] overflow-hidden select-none"
  >
    <!-- Animated background mesh gradients -->
    <div
      class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-green-600/35 blur-[120px] animate-pulse duration-[8000ms]"
    ></div>
    <div
      class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-500/25 blur-[120px] animate-pulse duration-[6000ms]"
    ></div>
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[150px]"
    ></div>

    <!-- Login card wrapper -->
    <div
      class="relative w-full max-w-md p-8 mx-4 rounded-3xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/[0.12] hover:shadow-[0_30px_60px_-10px_rgba(34,197,94,0.15)]"
    >
      <!-- Logo / Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-green-600/20 to-blue-500/20 border border-green-500/30 mb-4 shadow-inner"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-green-400 animate-spin-slow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2
          class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
        >
          {{ isLogin ? "Welcome Back to Host B" : "Create Host B Account" }}
        </h2>
        <p class="text-sm text-slate-400 mt-2">
          {{
            isLogin
              ? "Access your unified micro-frontend workspace (B)"
              : "Get started with your developer account (B)"
          }}
        </p>
      </div>

      <!-- Error alert banner -->
      <Transition name="fade-slide">
        <div
          v-if="errorMsg"
          class="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 flex-shrink-0 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ errorMsg }}</span>
        </div>
      </Transition>

      <!-- Input Form -->
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Username input group -->
        <div class="space-y-2">
          <label
            class="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1"
            >Username</label
          >
          <div class="relative group">
            <div
              class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              v-model="username"
              required
              autocomplete="username"
              placeholder="Enter your username"
              class="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-green-500/10 transition-all"
            />
          </div>
        </div>

        <!-- Password input group -->
        <div class="space-y-2">
          <label
            class="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1"
            >Password</label
          >
          <div class="relative group">
            <div
              class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              type="password"
              v-model="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-green-500/10 transition-all"
            />
          </div>
        </div>

        <!-- Confirm Password (Registration Only) -->
        <Transition name="fade-slide">
          <div v-if="!isLogin" class="space-y-2">
            <label
              class="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1"
              >Confirm Password</label
            >
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                  />
                  <path
                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                  />
                </svg>
              </div>
              <input
                type="password"
                v-model="confirmPassword"
                required
                autocomplete="new-password"
                placeholder="••••••••"
                class="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-green-500/10 transition-all"
              />
            </div>
          </div>
        </Transition>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full relative flex justify-center items-center py-3.5 px-4 mt-6 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:pointer-events-none shadow-[0_4px_20px_-2px_rgba(34,197,94,0.3)] transition-all cursor-pointer"
        >
          <span v-if="isLoading" class="absolute left-4">
            <svg
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
          <span>{{ isLogin ? "Sign In" : "Register Account" }}</span>
        </button>
      </form>

      <!-- Toggle Link -->
      <div class="mt-6 text-center">
        <button
          type="button"
          @click="toggleMode"
          class="text-sm font-medium text-slate-400 hover:text-green-400 transition-colors cursor-pointer"
        >
          {{
            isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 8s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Transition Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
