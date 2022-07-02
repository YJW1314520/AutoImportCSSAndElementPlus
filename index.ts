// 自动引入css文件+自动导入所需依赖
// 已经基本完成,正则稍微写好看了一点,逻辑稍微优化了一点.
import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { type Plugin } from 'vite'

export default function autoImport (config:{[x:string]:string[]}) {
  // 依据配置自动生成声明文件
  if (!readdirSync('./')
    .includes('autoImport.d.ts') && !readdirSync('./src')
    .includes('autoImport.d.ts') && !readdirSync('./src/types/')
    .includes('autoImport.d.ts') && Object.keys(config).length > 0) {
    let str = `/* eslint-disable no-unused-vars */
`
    for (const [pck, pckExport] of Object.entries(config)) {
      for (const exp of pckExport) {
        str += `declare let ${ exp }:typeof import('${ pck }')['${ exp }']
`
      }
    }
    writeFileSync('./src/types/autoImport.d.ts', str)
  }
  return {
    name: 'autoImport', // 插件名
    /**
     * 该函数对每一个要加载的文件调用，参数id就是它们的文件名
     * 它自带缓存
     * 该函数返回值会送到transform函数手中，当作这个被解析的文件的源代码
     * 此时，文件还未被解析
     * 因此我们可以在这里在代码上再做一层处理
     */
    load (id) {
      if (id.match(/\.tsx/)) {
        const fileContext = readFileSync(id)
          .toString()
        let cssString = ''
        let importString = ''
        const matchString = /(?<=\/)[^/]*(?=\.tsx)/
        const idName = id.match(matchString)?.[0]
        // 尝试着读取该目录下是否有同名css,导入进来
        if (
          idName &&
          readdirSync(id.slice(0, id.length - (idName.length + 5)))
            .includes(`${ idName }.css`)
        ) {
          if (!fileContext.match(new RegExp(`import *['"].*${ idName }.css['"]`))) {
            cssString += `import './${ idName }.css';`
          }
        }
        for (const [pck, pckExport] of Object.entries(config)) {
          importString += 'import {'
          for (const exp of pckExport) {
            if (
              !fileContext.match(new RegExp(`import *{[A-Za-z, ]*${ exp }[A-Za-z, ]*} *from *'${ pck }'`)) &&
              fileContext.match(`${ exp }`)
            ) {
              importString += `${ exp },`
            }
          }
          /*
           * 当某个包的所有依赖都已经被用户手动导入,importString此时等于 '..xxx;import {'
           * 所以切掉后面8位
           * 否则就补全
           */
          importString.at(importString.length - 1) === '{'
            ? importString = importString.slice(0, importString.length - 8)
            : importString += `} from '${ pck }';`
          // 当包为element-plus时,除了导入组件本身还需引入组件的css
          if (pck === 'element-plus') {
            // 匹配ElXyy然后去重
            const x = Array.from(new Set(fileContext.match(/El[A-Z][A-Za-z]*/g)))
            // 找不到就跳过匹配
            if (x.length === 0) continue
            for (const i of x) {
              cssString += `import 'element-plus/es/components/${
                i
                .replace(/([A-Z])/g, '-$1')
                .toLowerCase()
                .slice(4) }/style/css';`
            }
          }
        }
        return `${ cssString }${ importString }${ fileContext }`
      }
    }
  } as Plugin
}
