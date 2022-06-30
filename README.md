# AutoImportCSSAndElementPlus
自动导入与tsx组件同名的css文件，还有element-plus的组件和相应的css文件
## 使用示例
```ts
// 创建global.d.ts文件
declare let ElButton:typeof import('element-plus')['ElButton']
//...以及更多组件声明
```
然后，在vite.config.ts中引入该文件
```ts
// vite.config.ts
import autoImport from 'AutoImportCSSAndElementPlus'
//...
plugins:[/* ...你自己的插件 */,autoImport()]
```
