import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// import IconsResolver from 'unplugin-icons/resolver'
// import Icons from "unplugin-icons/vite";
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

// const hash = crypto.hash ?? ((algorithm, data, outputEncoding) =>
//   crypto.createHash(algorithm).update(data).digest(outputEncoding));
// https://vite.dev/config/
export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0'
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 将所有带短横线的标签名都视为自定义元素
          isCustomElement: (tag) => tag.includes('css-doodle')
        }
      }
    }),
    // vueDevTools(),
    tailwindcss(),
    AutoImport({
      imports: ["vue", "@vueuse/core"],
      resolvers: [
        ElementPlusResolver(), // 自动导入图标组件
        // IconsResolver({
        //   enabledCollections: ["ep", "fa", "fe"]
        // }),
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // IconsResolver({
        //   prefix: false,
        //   enabledCollections: ["ep", "fa", "fe"],
        // }),
      ],
    }),
    // Icons({
    //   autoInstall: true, // 是否自动安装对应的图标库，默认为true
    //   scale: 1, // 图标缩放，默认为1
    //   defaultStyle: "", // 图标style
    //   defaultClass: "", // 图标class
    //   compiler: 'vue3', // 编译方式，可选值：'vue2', 'vue3', 'jsx'
    //   jsx: "react", // jsx风格：'react' or 'preact'
    // }),
    vueSetupExtend(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api:'modern-compiler',
        javascriptEnabled: true,
        additionalData: '@use "@/assets/styles/variables.scss" as *;',
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
