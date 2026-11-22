# 后台管理系统（React 版）

一个纯前端的后台管理小系统：登录、路由守卫、概览统计、用户管理（搜索 / 分页 / 新增 / 编辑 / 删除）。

- 线上预览：部署后补充
- 演示账号：`admin` / `123456`

## 功能

- **登录与会话**：账号密码校验后写入 `localStorage`，刷新页面保持登录
- **路由守卫**：`ProtectedRoute` 拦截未登录访问，自动跳转登录页
- **后台布局**：侧边栏导航 + 顶栏标题，窄屏自动切换为顶部导航
- **概览页**：用户总数、启用数、角色分布等统计卡片
- **用户列表**
  - 关键词搜索（姓名 / 邮箱），输入后自动回到第 1 页
  - 分页展示，页码越界时自动回退（如删掉末页最后一条）
  - 加载中、空数据、请求失败三种状态
- **新增 / 编辑**：共用同一个表单弹窗，编辑时自动预填；姓名必填、邮箱格式校验
- **删除**：二次确认弹窗，操作期间禁用按钮并显示「处理中」，失败原因显示在弹窗内

## 技术栈

| 技术 | 用途 |
| --- | --- |
| React 19 | 组件、状态、受控表单 |
| React Router 7 | `HashRouter` 路由与嵌套路由 |
| Vite 8 | 开发服务器与打包 |
| 原生 CSS | Flex / Grid / 响应式布局 |
| Mock API | `Promise + setTimeout` 模拟网络请求 |

## 本地运行

```bash
npm install
npm run dev
```

打开终端显示的地址（默认 <http://localhost:5173>），使用 `admin / 123456` 登录。

```bash
npm run build     # 打包到 dist/
npm run preview   # 本地预览打包结果
npm run lint      # 代码检查
```

## 目录结构

```
src/
├── main.jsx                 # 入口：createRoot + 全局样式
├── App.jsx                  # 路由总装
├── auth.js                  # 登录态读写（localStorage）
├── styles.css               # 全部样式
├── api/
│   └── users.js             # 数据层：mock 接口
├── components/
│   ├── Layout.jsx           # 侧边栏 + 顶栏布局
│   ├── ProtectedRoute.jsx   # 路由守卫
│   ├── UserFormModal.jsx    # 新增 / 编辑共用弹窗
│   └── ConfirmDialog.jsx    # 通用确认弹窗
└── pages/
    ├── Login.jsx
    ├── Dashboard.jsx
    ├── UserList.jsx
    └── NotFound.jsx
```

## 设计说明

- **数据层与界面分离**：页面只调用 `fetchUsers / createUser / updateUser / deleteUser`，不直接操作数据。以后接入真实后端时只需重写 `api/users.js`，页面组件不用改。
- **状态驱动刷新**：增删改成功后，`refreshKey` 计数器 +1，触发 `useEffect` 重新请求列表，避免在每个事件里复制请求逻辑。
- **弹窗受控**：父组件决定弹窗开关和操作对象，弹窗内部只负责表单状态、校验与提交反馈。
- **请求竞态处理**：`useEffect` 中通过 `ignore` 标志忽略组件卸载后返回的响应，避免旧数据覆盖新状态。

## 已知限制

- 登录为前端模拟：账号密码硬编码在 `auth.js`，没有真实鉴权，仅用于演示路由守卫。
- 用户数据存放在内存数组中，刷新浏览器后恢复初始数据。
- 尚未接入真实后端，可替换为 json-server 或 Express。

## 后续计划

- [ ] 接入真实后端（json-server / Express）
- [ ] 部署到 Vercel
- [ ] 补充单元测试
