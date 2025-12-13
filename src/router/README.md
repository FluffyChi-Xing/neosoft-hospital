# router 模块

在 router 模块的 index 中配置了对于 /modules/folder/ 下所有路由文件扫描的自动方法,开发时请在 modules 下创建对应的页面的文件夹,并在文件夹下创建 index.ts 文件,用于配置当前页面的路由信息。

# 元数据

在 router 中可以配置元数据，可以被预处理的配置如下:

- title: 页面标题，用于在菜单中显示。
- hideInMenu: 是否在菜单中隐藏。
- icon: 菜单图标。

# 菜单配置

无需手动创建，系统会自动扫描 modules 下的路由文件并生成菜单。
