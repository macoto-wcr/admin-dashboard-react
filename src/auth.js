// 假登录：没有后端，用 localStorage 模拟"已登录"状态
// 真实项目里，这里会调用后端接口拿 token

const TOKEN_KEY = 'admin-token'
const USER_KEY = 'admin-username'

export const DEMO_ACCOUNT = {
    username: 'admin',
    password: '123456',
}

export function login(username, password) {
    // 用 setTimeout 模拟网络请求的延迟，顺便练 loading 状态
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (
                username === DEMO_ACCOUNT.username &&
                password === DEMO_ACCOUNT.password
            ) {
                localStorage.setItem(TOKEN_KEY, `fake-token-${Date.now()}`)
                localStorage.setItem(USER_KEY, username)
                resolve(username)
            } else {
                reject(new Error('用户名或密码错误'))
            }
        }, 600)
    })
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
}

export function isLoggedIn() {
    return Boolean(localStorage.getItem(TOKEN_KEY))
}

export function getUsername() {
    return localStorage.getItem(USER_KEY) || '未登录'
}
