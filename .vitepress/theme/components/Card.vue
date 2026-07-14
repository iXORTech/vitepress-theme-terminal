<script setup lang="ts">
// ============================================================================
// Card.vue — reusable TUI floating card (COMP-001)
// ============================================================================
// Cards are floating windows for featured content such as licenses, comments,
// welcome messages, and project entries (design-language.md §4,
// ui-sketch.md §6). The optional prompt is deliberately per-use data: only
// its `user` segment comes from the central author configuration. Host and path
// have useful page/site defaults, while consumers can override every segment.
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { useData } from 'vitepress'
import { normalizeShellIdentifier } from '../config'
import { useThemeConfig } from '../composables/useThemeConfig'
import { useSiteText } from '../composables/useSiteText'
import { formatPageLocation } from '../utils/pagePath'

interface CardPrompt {
  host?: string
  path?: string
  command: string
  args?: string
}

type PromptPathMode = 'full' | 'last' | 'ellipsis'

const props = withDefaults(
  defineProps<{
    prompt?: CardPrompt
    showPrompt?: boolean
  }>(),
  { showPrompt: false },
)

const { page } = useData()
const config = useThemeConfig()
const { title: siteTitle } = useSiteText()
const promptElement = ref<HTMLElement | null>(null)
const showPromptHost = ref(true)
const promptPathMode = ref<PromptPathMode>('full')
let promptResizeObserver: ResizeObserver | null = null
let promptFitVersion = 0

// Keep the prompt user tied to CONF-002 and derive defaults from the current
// site/page context; consumers can override every prompt segment.
const shellPrompt = computed(() => {
  const prompt = props.prompt
  if (!props.showPrompt || !prompt) return null

  const command = prompt.command.trim()
  const args = prompt.args?.trim() ?? ''

  return {
    user: config.value.author.username,
    host: normalizeShellIdentifier(
      prompt.host ?? (config.value.siteName || siteTitle.value),
    ),
    path: prompt.path ?? formatPageLocation(page.value.relativePath),
    command,
    args,
  }
})

function lastPathSection(path: string): string {
  const normalizedPath = path.replace(/\/+$/, '')
  if (!normalizedPath) return path

  const slashIndex = normalizedPath.lastIndexOf('/')
  if (slashIndex < 0) return normalizedPath

  const section = normalizedPath.slice(slashIndex + 1)
  if (!section) return normalizedPath

  return section
}

const displayedPromptPath = computed(() => {
  const prompt = shellPrompt.value
  if (!prompt || promptPathMode.value === 'full') return prompt?.path ?? ''
  return lastPathSection(prompt.path)
})

function promptOverflows(): boolean {
  const element = promptElement.value
  return element ? element.scrollWidth > element.clientWidth : false
}

async function fitPrompt() {
  const fitVersion = ++promptFitVersion
  showPromptHost.value = true
  promptPathMode.value = 'full'

  await nextTick()
  if (
    fitVersion !== promptFitVersion ||
    !shellPrompt.value ||
    !promptElement.value ||
    !promptOverflows()
  ) {
    return
  }

  showPromptHost.value = false
  await nextTick()
  if (fitVersion !== promptFitVersion || !promptElement.value || !promptOverflows()) {
    return
  }

  promptPathMode.value = 'last'
  await nextTick()
  if (fitVersion !== promptFitVersion || !promptElement.value || !promptOverflows()) {
    return
  }

  promptPathMode.value = 'ellipsis'
}

watch(shellPrompt, () => {
  void fitPrompt()
}, { flush: 'post' })

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined' && promptElement.value) {
    promptResizeObserver = new ResizeObserver(() => {
      void fitPrompt()
    })
    promptResizeObserver.observe(promptElement.value)
  }

  void fitPrompt()
})

onBeforeUnmount(() => {
  promptFitVersion += 1
  promptResizeObserver?.disconnect()
})
</script>

<template>
  <div class="ct-card">
    <!-- Prompt visibility is explicit; user and host come from theme identity -->
    <div
      v-if="shellPrompt"
      ref="promptElement"
      class="ct-card__prompt"
      :class="{ 'ct-card__prompt--path-ellipsis': promptPathMode === 'ellipsis' }"
    >
      <span class="ct-card__prompt-user">{{ shellPrompt.user }}</span>
      <template v-if="showPromptHost">
        <span class="ct-card__prompt-punctuation">@</span>
        <span class="ct-card__prompt-host">{{ shellPrompt.host }}</span>
      </template>
      <span class="ct-card__prompt-punctuation">:</span>
      <span class="ct-card__prompt-path">{{ displayedPromptPath }}</span>
      <span class="ct-card__prompt-punctuation">$</span>
      <span v-if="shellPrompt.command" class="ct-card__prompt-command">{{ ` ${shellPrompt.command}` }}</span>
      <span v-if="shellPrompt.args" class="ct-card__prompt-args">{{ ` ${shellPrompt.args}` }}</span>
    </div>

    <!-- Card content belongs to the consuming component -->
    <div class="ct-card__body">
      <slot />
    </div>
  </div>
</template>
