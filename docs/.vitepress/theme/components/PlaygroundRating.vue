<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { VRating } from 'vue-rating-kit'

type SizePreset = 'none' | 'sm' | 'md' | 'lg' | 'custom'
type IconSet = 'default' | 'hearts' | 'emoji' | 'svg'

const modelValue = ref(3)
const max = ref(5)
const step = ref(1)
const sizePreset = ref<SizePreset>('none')
const sizeCustom = ref(32)
const colorActive = ref(false)
const colorValue = ref('#f5a623')
const emptyColorActive = ref(false)
const emptyColorValue = ref('#d3d3d3')
const hoverColorActive = ref(false)
const hoverColorValue = ref('#f5c842')
const isReadonly = ref(false)
const isDisabled = ref(false)
const isRtl = ref(false)
const iconSet = ref<IconSet>('default')
const copied = ref(false)

watch(max, (newMax) => {
  if (modelValue.value > newMax) modelValue.value = newMax
  if (step.value > newMax) step.value = 1
})

const extraProps = computed(() => {
  const p: Record<string, unknown> = {}
  if (max.value !== 5) p.max = max.value
  if (step.value !== 1) p.step = step.value
  if (sizePreset.value !== 'none') {
    p.size = sizePreset.value === 'custom' ? sizeCustom.value : sizePreset.value
  }
  if (colorActive.value) p.color = colorValue.value
  if (emptyColorActive.value) p.emptyColor = emptyColorValue.value
  if (hoverColorActive.value) p.hoverColor = hoverColorValue.value
  if (isReadonly.value) p.readonly = true
  if (isDisabled.value) p.disabled = true
  return p
})

function slotContent(): { filled: string; empty: string } {
  if (iconSet.value === 'hearts') return { filled: '❤️', empty: '🤍' }
  if (iconSet.value === 'emoji') return {
    filled: '😍',
    empty: '<span style="filter: grayscale(1)">😍</span>',
  }
  if (iconSet.value === 'svg') return {
    filled: '<svg viewBox="0 0 24 24" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path fill="currentColor" d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z"/></svg>',
    empty: '<svg viewBox="0 0 24 24" width="1em" height="1em" style="display:inline-block;vertical-align:middle"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z"/></svg>',
  }
  return { filled: '', empty: '' }
}

const generatedCode = computed(() => {
  const lines: string[] = []
  const hasSlots = iconSet.value !== 'default'
  const ind = isRtl.value ? '    ' : '  '

  lines.push('<script setup lang="ts">')
  lines.push("import { ref } from 'vue'")
  lines.push("import { VRating } from 'vue-rating-kit'")
  lines.push("import 'vue-rating-kit/style.css'")
  lines.push('')
  lines.push(`const rating = ref(${modelValue.value})`)
  lines.push('<' + '/script>')
  lines.push('')
  lines.push('<template>')
  if (isRtl.value) lines.push('  <div dir="rtl">')

  const props: string[] = ['v-model="rating"']
  if (max.value !== 5) props.push(`:max="${max.value}"`)
  if (step.value !== 1) props.push(`:step="${step.value}"`)
  if (sizePreset.value !== 'none') {
    props.push(sizePreset.value === 'custom' ? `:size="${sizeCustom.value}"` : `size="${sizePreset.value}"`)
  }
  if (colorActive.value) props.push(`color="${colorValue.value}"`)
  if (emptyColorActive.value) props.push(`emptyColor="${emptyColorValue.value}"`)
  if (hoverColorActive.value) props.push(`hoverColor="${hoverColorValue.value}"`)
  if (isReadonly.value) props.push('readonly')
  if (isDisabled.value) props.push('disabled')

  if (props.length === 1 && !hasSlots) {
    lines.push(`${ind}<VRating ${props[0]} />`)
  } else if (!hasSlots) {
    lines.push(`${ind}<VRating`)
    props.forEach(p => lines.push(`${ind}  ${p}`))
    lines.push(`${ind}/>`)
  } else {
    lines.push(`${ind}<VRating`)
    props.forEach(p => lines.push(`${ind}  ${p}`))
    lines.push(`${ind}>`)
    const { filled, empty } = slotContent()
    lines.push(`${ind}  <template #filled>${filled}</template>`)
    lines.push(`${ind}  <template #empty>${empty}</template>`)
    lines.push(`${ind}<` + `/VRating>`)
  }

  if (isRtl.value) lines.push('  </div>')
  lines.push('</template>')
  return lines.join('\n')
})

function tokenize(code: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const sp = (cls: string, txt: string) => `<span class="tok-${cls}">${txt}</span>`

  return code.split('\n').map(line => {
    const trimmed = line.trimStart()
    const indent = esc(line.slice(0, line.length - trimmed.length))
    if (!trimmed) return ''

    // Block tags
    if (/^<\/?(script|template)\b/.test(trimmed)) {
      return indent + sp('tag', esc(trimmed))
    }

    // Side-effect import: import 'vue-rating-kit/style.css'
    if (/^import '/.test(trimmed)) {
      return indent + sp('keyword', 'import') + ' ' + sp('string', esc(trimmed.slice(7)))
    }

    // Named import: import { ref } from 'vue'
    if (trimmed.startsWith('import ')) {
      return indent + trimmed
        .replace(/^(import)/, (m) => sp('keyword', m))
        .replace(/\b(from)\b/, (m) => sp('keyword', m))
        .replace(/'([^']+)'/, (_, p) => sp('string', `'${p}'`))
    }

    // const rating = ref(3)
    if (trimmed.startsWith('const ')) {
      return indent + trimmed
        .replace(/\b(const)\b/, (m) => sp('keyword', m))
        .replace(/\bref\b/, (m) => sp('keyword', m))
        .replace(/\b([0-9.]+)\b/, (m) => sp('number', m))
    }

    // <VRating or </VRating
    if (/^<\/?VRating\b/.test(trimmed)) {
      return indent + sp('component', esc(trimmed))
    }

    // />
    if (trimmed === '/>') return indent + sp('punct', '/&gt;')

    // RTL wrapper: <div dir="rtl"> or </div>
    if (trimmed.startsWith('<div') || trimmed === '</div>') {
      return indent + sp('tag', esc(trimmed))
    }

    // Slot template lines: <template #filled>...</template>
    if (/^<\/?template\b/.test(trimmed)) {
      return indent + sp('tag', esc(trimmed))
    }

    // Boolean props: readonly, disabled
    if (/^(readonly|disabled)$/.test(trimmed)) {
      return indent + sp('attr', trimmed)
    }

    // Prop with value: v-model="rating", :max="5", color="#e63946", size="lg"
    const propMatch = /^(v-model|:[a-zA-Z]+|[a-zA-Z][a-zA-Z]*)=(".+")$/.exec(trimmed)
    if (propMatch) {
      return indent + sp('attr', esc(propMatch[1])) + '=' + sp('string', esc(propMatch[2]))
    }

    return indent + esc(trimmed)
  }).join('\n')
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(generatedCode.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // clipboard API not available
  }
}
</script>

<template>
  <div class="pg">
    <!-- Preview -->
    <div class="pg-preview">
      <div class="pg-preview-label">Preview</div>
      <div class="pg-preview-stage" :dir="isRtl ? 'rtl' : undefined">
        <VRating v-model="modelValue" v-bind="extraProps">
          <template v-if="iconSet !== 'default'" #filled>
            <span v-if="iconSet === 'hearts'">❤️</span>
            <span v-else-if="iconSet === 'emoji'">😍</span>
            <svg
              v-else-if="iconSet === 'svg'"
              viewBox="0 0 24 24"
              width="1em"
              height="1em"
              style="display: inline-block; vertical-align: middle"
            >
              <path fill="currentColor" d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" />
            </svg>
          </template>
          <template v-if="iconSet !== 'default'" #empty>
            <span v-if="iconSet === 'hearts'">🤍</span>
            <span v-else-if="iconSet === 'emoji'" style="filter: grayscale(1)">😍</span>
            <svg
              v-else-if="iconSet === 'svg'"
              viewBox="0 0 24 24"
              width="1em"
              height="1em"
              style="display: inline-block; vertical-align: middle"
            >
              <path fill="none" stroke="currentColor" stroke-width="2" d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" />
            </svg>
          </template>
        </VRating>
      </div>
    </div>

    <!-- Controls + Code -->
    <div class="pg-body">
      <!-- Controls -->
      <div class="pg-controls">
        <div class="pg-row">
          <span class="pg-label">Rating</span>
          <div class="pg-field pg-slider-field">
            <input
              type="range"
              :min="0"
              :max="max"
              :step="step"
              v-model.number="modelValue"
              class="pg-slider"
            />
            <span class="pg-value">{{ modelValue }}</span>
          </div>
        </div>

        <div class="pg-row">
          <span class="pg-label">Max</span>
          <div class="pg-field">
            <input type="number" v-model.number="max" :min="1" :max="20" class="pg-input-num" />
          </div>
        </div>

        <div class="pg-row">
          <span class="pg-label">Step</span>
          <div class="pg-field">
            <select v-model.number="step" class="pg-select">
              <option :value="1">1</option>
              <option :value="0.5">0.5</option>
              <option :value="0.25">0.25</option>
              <option :value="0.2">0.2</option>
              <option :value="0.1">0.1</option>
            </select>
          </div>
        </div>

        <div class="pg-row">
          <span class="pg-label">Size</span>
          <div class="pg-field pg-radios">
            <label v-for="opt in ['none', 'sm', 'md', 'lg', 'custom']" :key="opt" class="pg-radio-label">
              <input type="radio" :value="opt" v-model="sizePreset" />
              {{ opt }}
            </label>
            <input
              v-if="sizePreset === 'custom'"
              type="number"
              v-model.number="sizeCustom"
              :min="12"
              :max="96"
              class="pg-input-num"
              style="margin-left: 4px"
            />
          </div>
        </div>

        <div class="pg-row">
          <span class="pg-label">Color</span>
          <div class="pg-field pg-color-field">
            <input type="checkbox" v-model="colorActive" class="pg-checkbox" />
            <input
              type="color"
              :value="colorValue"
              :disabled="!colorActive"
              @input="colorValue = ($event.target as HTMLInputElement).value; colorActive = true"
              class="pg-color"
            />
            <span v-if="!colorActive" class="pg-hint">default</span>
          </div>
        </div>

        <div class="pg-row">
          <span class="pg-label">Empty Color</span>
          <div class="pg-field pg-color-field">
            <input type="checkbox" v-model="emptyColorActive" class="pg-checkbox" />
            <input
              type="color"
              :value="emptyColorValue"
              :disabled="!emptyColorActive"
              @input="emptyColorValue = ($event.target as HTMLInputElement).value; emptyColorActive = true"
              class="pg-color"
            />
            <span v-if="!emptyColorActive" class="pg-hint">default</span>
          </div>
        </div>

        <div class="pg-row">
          <span class="pg-label">Hover Color</span>
          <div class="pg-field pg-color-field">
            <input type="checkbox" v-model="hoverColorActive" class="pg-checkbox" />
            <input
              type="color"
              :value="hoverColorValue"
              :disabled="!hoverColorActive"
              @input="hoverColorValue = ($event.target as HTMLInputElement).value; hoverColorActive = true"
              class="pg-color"
            />
            <span v-if="!hoverColorActive" class="pg-hint">default</span>
          </div>
        </div>

        <div class="pg-row">
          <span class="pg-label">Readonly</span>
          <div class="pg-field">
            <input type="checkbox" v-model="isReadonly" class="pg-checkbox" />
          </div>
        </div>

        <div class="pg-row">
          <span class="pg-label">Disabled</span>
          <div class="pg-field">
            <input type="checkbox" v-model="isDisabled" class="pg-checkbox" />
          </div>
        </div>

        <div class="pg-row">
          <span class="pg-label">RTL</span>
          <div class="pg-field">
            <input type="checkbox" v-model="isRtl" class="pg-checkbox" />
          </div>
        </div>

        <div class="pg-row">
          <span class="pg-label">Icon Set</span>
          <div class="pg-field pg-radios">
            <label class="pg-radio-label"><input type="radio" value="default" v-model="iconSet" /> ★ Default</label>
            <label class="pg-radio-label"><input type="radio" value="hearts" v-model="iconSet" /> ❤️ Hearts</label>
            <label class="pg-radio-label"><input type="radio" value="emoji" v-model="iconSet" /> 😍 Emoji</label>
            <label class="pg-radio-label"><input type="radio" value="svg" v-model="iconSet" /> ♥ SVG</label>
          </div>
        </div>
      </div>

      <!-- Generated Code -->
      <div class="pg-code-panel">
        <div class="pg-code-header">
          <span class="pg-code-label">Generated Code</span>
          <button class="pg-copy-btn" @click="copyCode">
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <pre class="pg-code"><code v-html="tokenize(generatedCode)" /></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pg {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
  margin: 1.5rem 0;
  font-size: 0.875rem;
}

/* Preview */
.pg-preview {
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
}

.pg-preview-label {
  padding: 6px 14px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--vp-c-border);
}

.pg-preview-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90px;
  padding: 24px;
}

/* Body */
.pg-body {
  display: grid;
  grid-template-columns: 30fr 70fr;
  min-height: 280px;
}

@media (max-width: 768px) {
  .pg-body {
    grid-template-columns: 1fr;
  }
}

/* Controls */
.pg-controls {
  padding: 12px 14px;
  border-right: 1px solid var(--vp-c-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 768px) {
  .pg-controls {
    border-right: none;
    border-bottom: 1px solid var(--vp-c-border);
  }
}

.pg-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-height: 24px;
}

.pg-label {
  flex-shrink: 0;
  width: 72px;
  padding-top: 2px;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
  white-space: nowrap;
}

.pg-field {
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.pg-slider-field {
  gap: 8px;
}

.pg-slider {
  flex: 1;
  accent-color: var(--vp-c-brand-1);
  min-width: 0;
}

.pg-value {
  min-width: 28px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
}

.pg-input-num {
  width: 56px;
  padding: 2px 6px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
}

.pg-select {
  padding: 2px 6px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
}

.pg-checkbox {
  accent-color: var(--vp-c-brand-1);
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.pg-radios {
  flex-wrap: wrap;
  gap: 6px;
}

.pg-radio-label {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.8rem;
  color: var(--vp-c-text-1);
  cursor: pointer;
  white-space: nowrap;
}

.pg-radio-label input[type='radio'] {
  accent-color: var(--vp-c-brand-1);
}

.pg-color-field {
  gap: 6px;
}

.pg-color {
  width: 28px;
  height: 22px;
  padding: 1px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
  cursor: pointer;
}

.pg-color:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pg-hint {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-style: italic;
}

/* Code panel */
.pg-code-panel {
  display: flex;
  flex-direction: column;
  background: var(--vp-code-block-bg);
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

.pg-code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  border-bottom: 1px solid var(--vp-c-border);
}

.pg-code-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pg-copy-btn {
  padding: 2px 10px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.pg-copy-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.pg-code {
  margin: 0;
  padding: 14px;
  overflow: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  line-height: 1.6;
  color: var(--vp-code-color);
  white-space: pre;
  flex: 1;
}

/* Syntax token colors */
.pg-code :deep(.tok-tag) { color: var(--vp-c-brand-2, #3d8eff); }
.pg-code :deep(.tok-component) { color: var(--vp-c-green-2, #42b883); }
.pg-code :deep(.tok-attr) { color: var(--vp-c-indigo-2, #8888ff); }
.pg-code :deep(.tok-string) { color: var(--vp-c-yellow-2, #d4a72c); }
.pg-code :deep(.tok-keyword) { color: var(--vp-c-purple-2, #c678dd); }
.pg-code :deep(.tok-number) { color: var(--vp-c-green-2, #42b883); }
.pg-code :deep(.tok-punct) { color: var(--vp-c-text-3); }
</style>
