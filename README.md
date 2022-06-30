# AutoImportCSSAndElementPlus
# 本插件只适用于基于vite+jsx/tsx的项目
自动导入与tsx组件同名的css文件，还有element-plus的组件和相应的css文件
## 使用示例
在vite.config.ts中引入index.ts文件
```ts
// vite.config.ts
import autoImport from './index.ts'
// 路径请自行调整
// ...
plugins:[/* ...你自己的插件 */,
  autoImport(
  {
      /* 包名 */ 'element-plus': [
        'ElButton', /* 导出成员名 */
        'ElCard',
        'ElForm',
        'ElFormItem',
        'ElInput',
        'ElCol',
        'ElDatePicker',
        'ElSelect',
        'ElCheckbox',
        'ElCheckboxGroup',
        'ElRadioGroup',
        'ElRadio',
        'ElOption',
        'ElTimePicker',
        'ElSwitch',
        // 另外的。。
      ]
    }
  )
  ]
```
**第一次直接运行即可,会在src/types目录下创建autoImport.d.ts文件.请先确保src/types这个目录存在!**

之后因为有了这个文件,不会再重新创建文件,所以更改配置后需要删掉原本的autoImport.d.ts文件.

有空了还会尽量完善.
