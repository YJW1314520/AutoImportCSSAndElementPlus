// [x] 自动引入css文件+自动导入element-plus组件
import { readFileSync, readdirSync } from 'fs'
import { type Plugin } from 'vite'

export default function myPlugin () {
  return {
    name: 'autoImportElementPlus', // 插件名
    /**
     * 该函数对每一个要加载的文件调用，参数id就是它们的文件名
     * 它自带缓存
     * 该函数返回值会送到transform函数手中，当作这个被解析的文件的源代码
     * 此时，文件还未被解析
     * 因此我们可以在这里在代码上再做一层处理
     */
    load (id) {
      if (id.match(/\.tsx/)) {
        const z = readFileSync(id)
          .toString()
        let string1 = ''
        let string2 = ''
        const matchString = /(?<=\/)[^/]*(?=\.tsx)/
        const idName = id.match(matchString)?.[0]
        // 尝试着读取该目录下是否有同名css
        if (idName && readdirSync(id.slice(0, id.length - (idName.length + 5)))
          .includes(`${ idName }.css`)) {
          if (!z.match(new RegExp(`[?<=import].*${ idName }.css('|")`))) {
            string1 += `import './${ idName }.css';`
          }
        }
        const x = Array.from(new Set(z.match(/El[A-Z][A-Za-z]*/g)))
        if (x.length === 0) return
        for (const i of x) {
          // 修复逻辑,因为有些组件是多词汇,比如ElTimePicker,其对应文件夹为time-picker
          string1 += `import 'element-plus/es/components/${
            i
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
            .slice(4) }/style/css';`
          if (!z.match(new RegExp(`import.*${ i }[^{}]*}`))) {
            string2 += `${ i },`
          }
        }
        return `${ string1 }import {${ string2 }} from 'element-plus';${ z }`
      }
    }
  } as Plugin
}
