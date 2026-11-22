// 模拟后端数据。以后接真实接口时，只需要改这个文件，
// 页面代码一行都不用动 —— 这就是"数据层"的作用。

export const USERS = [
    { id: 1, name: '张伟', email: 'zhangwei@example.com', role: '管理员', status: '启用', createdAt: '2026-10-02' },
    { id: 2, name: '李娜', email: 'lina@example.com', role: '编辑', status: '启用', createdAt: '2026-10-05' },
    { id: 3, name: '王强', email: 'wangqiang@example.com', role: '访客', status: '停用', createdAt: '2026-10-08' },
    { id: 4, name: '刘洋', email: 'liuyang@example.com', role: '编辑', status: '启用', createdAt: '2026-10-11' },
    { id: 5, name: '陈静', email: 'chenjing@example.com', role: '访客', status: '启用', createdAt: '2026-10-15' },
    { id: 6, name: '杨帆', email: 'yangfan@example.com', role: '管理员', status: '启用', createdAt: '2026-10-18' },
    { id: 7, name: '赵敏', email: 'zhaomin@example.com', role: '编辑', status: '停用', createdAt: '2026-10-21' },
    { id: 8, name: '孙磊', email: 'sunlei@example.com', role: '访客', status: '启用', createdAt: '2026-10-25' },
    { id: 9, name: '周婷', email: 'zhouting@example.com', role: '编辑', status: '启用', createdAt: '2026-10-28' },
    { id: 10, name: '吴昊', email: 'wuhao@example.com', role: '访客', status: '停用', createdAt: '2026-11-01' },
    { id: 11, name: '郑爽', email: 'zhengshuang@example.com', role: '编辑', status: '启用', createdAt: '2026-11-06' },
    { id: 12, name: '冯雪', email: 'fengxue@example.com', role: '访客', status: '启用', createdAt: '2026-11-10' },
]

// 支持关键词搜索 + 分页，模拟真实后端接口的返回格式
// 返回：{ list: 当前页数据, total: 总条数 }
export function fetchUsers({ keyword = '', page = 1, pageSize = 5 } = {}) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const text = keyword.trim().toLowerCase()
            const filtered = USERS.filter(
                (user) =>
                    user.name.toLowerCase().includes(text) ||
                    user.email.toLowerCase().includes(text),
            )
            const start = (page - 1) * pageSize
            resolve({
                list: filtered.slice(start, start + pageSize),
                total: filtered.length,
            })
        }, 200)
    })
}

// ============================================================
// 增删改：模拟后端接口
// 把 USERS 当成"数据库"，下面每个函数就是一个"接口"。
// 页面只调用函数，不直接改数组 —— 以后接真后端，只改这个文件。
// ============================================================

// 模拟网络延迟。返回一个 Promise，200ms 后才会"完成"。
// 这样调用方可以写 await delay()，就像真的在等服务器。
function delay(ms = 200) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

// 生成今天的日期字符串，格式：2026-11-22
// getMonth() 从 0 开始（0 是一月），所以要 +1；padStart 补齐两位数。
function today() {
    const d = new Date()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${m}-${day}`
}

// 新增用户。input 是表单数据：{ name, email, role, status }
export async function createUser(input) {
    await delay() // 等 200ms，假装在请求后端

    // 生成新 id：找出当前最大的 id，再 +1。
    // reduce 的初始值是 0，所以空数组时 id 从 1 开始。
    const id = USERS.reduce((max, u) => Math.max(max, u.id), 0) + 1

    // 组装一条完整用户记录。前端只填了 4 个字段，
    // id 和 createdAt 由"后端"补上 —— 真实后端也是这么做的。
    const user = {
        id,
        name: input.name.trim(), // trim：去掉首尾空格，防止" 张伟 "
        email: input.email.trim(),
        role: input.role,
        status: input.status,
        createdAt: today(),
    }

    USERS.push(user) // 写进"数据库"（数组末尾加一条）
    return user // 把新用户交还给调用方（以后可能要用它的 id）
}

// 编辑用户。id 指明改谁，patch 是要改的字段。
export async function updateUser(id, patch) {
    await delay()

    // 找到这个 id 在数组里的位置；找不到返回 -1。
    const index = USERS.findIndex((u) => u.id === id)
    if (index === -1) throw new Error('用户不存在')
    // throw 会让调用方的 await 进入 catch，跟真接口返回 404 的效果一样。

    // 用新对象替换旧对象：
    //   先展开旧数据（保留 id、createdAt 等没改的字段）
    //   再展开 patch（覆盖 name、email、role、status）
    USERS[index] = {
        ...USERS[index],
        ...patch,
        name: patch.name.trim(),
        email: patch.email.trim(),
    }

    return USERS[index] // 返回更新后的完整记录
}

// 删除用户。只需要 id。
export async function deleteUser(id) {
    await delay()

    const index = USERS.findIndex((u) => u.id === id)
    if (index === -1) throw new Error('用户不存在')

    // splice(从哪开始, 删几个)：从 index 位置删掉 1 条。
    // 后面的元素会自动往前补位，数组不会留空洞。
    USERS.splice(index, 1)
}
