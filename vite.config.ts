import path from 'path'
import type { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import visualizer from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Pages from 'vite-plugin-pages'
import Unocss from 'unocss/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'

export default ({ command }: any) => {
  const config: UserConfig = {
    plugins: [
      Vue({
        reactivityTransform: true,
      }),
      DefineOptions(),
      Unocss(),
      Components({
        dts: true,
      }),
      Pages(),
      AutoImport({
        imports: ['vue', 'vue-router', 'vue/macros', '@vueuse/core', 'pinia'],
        dts: true,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
  }

  if (command === 'build') {
    config.plugins.push(
      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    )
  }

  return config
}
