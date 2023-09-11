/*
 * @Author: xuxueliang
 * @Date: 2023-08-31 15:16:40
 * @LastEditTime: 2023-09-08 14:31:31
 * @LastEditors: xuxueliang
 * @Description: 
 */
import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    lib: {
      entry: './src/inject.ts',
      fileName: 'index'
    },
    rollupOptions: {
      output: [{
        file: 'bundle.esm.js',
        format: 'esm'
      },
      {
        file: 'bundle.cjs.js',
        format: 'commonjs',
      }
      ]
    }
  }
})
