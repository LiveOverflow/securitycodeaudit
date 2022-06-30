<template>
  <div
    class="pb-12 mx-auto max-w-screen-xl min-h-screen w-full drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] bg-darker"
  >
    <nav class="bg-dark text-white text-base flex flex-row pt-1">
      <div class="tracking-wider px-5 py-2">
        <router-link :to="{ name: 'home' }" class="font-bold py-2"
          >SecurityCodeAudit</router-link
        >
        <span class="text-xs opacity-50 py-2 pl-2">by</span>
        <a
          target="_blank"
          href="https://www.hextree.io"
          class="text-xs opacity-50 hover:opacity-100 transition-opacity py-2 px-1"
        >
          <span class="font-bold">hextree</span
          ><span class="text-green font-bold">.</span>io
        </a>
      </div>
      <router-link
        :to="{ name: 'idor-examples' }"
        class="hover:text-opacity-100 transition border-b-2 text-white px-5 py-2"
        :class="
          $route.matched.some(({ name }) => name?.toString().indexOf('idor-examples') != -1)
            ? 'border-green text-opacity-100'
            : 'border-dark text-opacity-50'
        "
        >Examples</router-link
      >
      <router-link
        :to="{ name: 'idor-calculator' }"
        class="hover:text-opacity-100 transition border-b-2 text-white px-5 py-2"
        :class="
          $route.matched.some(({ name }) => name?.toString().indexOf('idor-calculator') != -1)
            ? 'border-green text-opacity-100'
            : 'border-dark text-opacity-50'
        "
        >IDOR Calculator</router-link
      >
      <router-link
        :to="{ name: 'idor-video' }"
        class="hover:text-opacity-100 transition border-b-2 text-white px-5 py-2"
        :class="
          $route.matched.some(({ name }) => name?.toString().indexOf('idor-video') != -1)
            ? 'border-green text-opacity-100'
            : 'border-dark text-opacity-50'
        "
        >Learn</router-link
      >
    </nav>
    <div class="w-full">
      <RouterView />
    </div>
    <footer class="border-t-4 border-dark w-full text-white mt-5">
    <div class="pl-6 mr-5 my-4 py-3 opacity-60">
      <div class="mb-1 text-base">
        <a
          href="https://twitter.com/hextreeio"
          target="_blank"
          class="text-white hover:text-green mr-2"
        >
          <i class="fab fa-twitter" />
        </a>
        <a
          href="https://instagram.com/hextreeio"
          target="_blank"
          class="text-white hover:text-green mr-2"
        >
          <i class="fab fa-instagram" />
        </a>
        <a
          href="https://youtube.com/LiveOverflow"
          target="_blank"
          class="text-white hover:text-green mr-2"
        >
          <i class="fab fa-youtube" />
        </a>
      </div>
      <div class="text-xs">
        <a
          href="https://www.hextree.io/legal"
          class="text-white hover:text-green"
          target="_blank"
          >&copy; {{ new Date().getFullYear() }} hextree.io. All rights
          reserved. Imprint.</a
        >
      </div>
    </div>
  </footer>
  </div>
  
</template>

<script setup lang="ts"></script>
