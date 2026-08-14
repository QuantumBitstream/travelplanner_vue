<template>
  <footer class="border-t bg-white/80 backdrop-blur dark:border-white/10 dark:bg-gray-900/60">
    <div class="mx-auto max-w-7xl px-4 py-10">
      <div class="grid gap-8 md:grid-cols-3">
        <div>
          <div class="flex items-center gap-2">
            <div class="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
              <span class="text-sm font-semibold">TP</span>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">TravelPlanner</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Plan your trip smarter</div>
            </div>
          </div>

          <p class="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            Build itineraries, manage budgets, and keep everything organized in one place.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-6 md:justify-self-center">
          <div>
            <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">Suggestion</div>
            <ul class="mt-3 space-y-2 text-sm">
              <li>
                <RouterLink to="/destinations" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Destinations
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/itineraries" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Itineraries
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/budget" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Budget
                </RouterLink>
              </li>
            </ul>
          </div>

          <div>
            <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">Discuss</div>
            <ul class="mt-3 space-y-2 text-sm">
              <li>
                <RouterLink to="/about" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  About
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/privacy" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Privacy
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/terms" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Terms
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <div class="md:justify-self-end">
          <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">Stay in touch</div>
          <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
            Want page update? Please tell me.
          </p>

          <div class="mt-4 flex items-center gap-2">
            <a
                href="#"
                class="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white/60 px-3 py-2 text-sm text-gray-800 shadow-sm hover:bg-gray-100 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Wechat
            </a>
            <a
                href="#"
                class="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white/60 px-3 py-2 text-sm text-gray-800 shadow-sm hover:bg-gray-100 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div class="mt-10 flex flex-col gap-3 border-t pt-6 text-sm text-gray-600 dark:border-white/10 dark:text-gray-300 md:flex-row md:items-center md:justify-between">
        <div>© {{ new Date().getFullYear() }} TravelPlanner. All rights reserved.</div>
        <div><a href="https://beian.miit.gov.cn/" target="_blank">© 苏ICP备2025198024号</a></div>
        <div class="flex items-center gap-4">
          <RouterLink to="/contact" class="hover:text-gray-900 dark:hover:text-white">
            Contact
          </RouterLink>
          <span class="text-gray-300 dark:text-gray-600">·</span>
          <RouterLink to="/status" class="hover:text-gray-900 dark:hover:text-white">
            Status
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
// No script needed; kept for future extension.
</script>
