/* global process */
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      indent: ['error', 2, { switchCase: 1 }], // 缩进使用 2 个空格
      'linebreak-style': ['error', 'unix'], // 使用 Unix 风格的换行符
      quotes: ['error', 'single'], // 使用单引号
      semi: ['error', 'never'], // 语句末尾不加分号
      'no-unused-vars': 'warn', // 未使用的变量警告
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 生产环境中警告 console 使用，开发环境中关闭规则
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 生产环境中警告 debugger 使用，开发环境中关闭规则
    },
  },
])
