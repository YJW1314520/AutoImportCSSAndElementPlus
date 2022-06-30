# AutoImportCSSAndElementPlus
自动导入与tsx组件同名的css文件，还有element-plus的组件和相应的css文件
## 使用示例
```ts
// 创建global.d.ts文件
/* eslint-disable no-unused-vars */
// eslint会报错，所以在本文件取消掉
declare let ElButton:typeof import('element-plus')['ElButton']
declare let ElForm: typeof import('element-plus')['ElForm']
declare let ElInput: typeof import('element-plus')['ElInput']
declare let ElCol: typeof import('element-plus')['ElCol']
declare let ElSelect: typeof import('element-plus')['ElSelect']
declare let ElCheckbox: typeof import('element-plus')['ElCheckbox']
// ...以及更多组件声明
```
然后，在vite.config.ts中引入index.ts文件
```ts
// vite.config.ts
import autoImport from './index.ts'
// 路径请自行调整
// ...
plugins:[/* ...你自己的插件 */,autoImport()]
```
