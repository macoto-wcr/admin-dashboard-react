import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { DEMO_ACCOUNT, isLoggedIn, login } from '../auth.js'
import loginBg from '../assets/login-bg.jpg'

export default function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // 已经登录过的人，不用再看登录页；有"原本想去的地方"就回到那里
    if (isLoggedIn()) {
        const target = location.state?.from || '/dashboard'
        return <Navigate to={target} replace />
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(username, password)
            // 优先回到"被拦截前想去的地方"
            const target = location.state?.from || '/dashboard'
            navigate(target, { replace: true })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="login-page"
            style={{
                // 风景图 + 一层柔和的暗色遮罩，让白色卡片更清楚
                backgroundImage: `linear-gradient(180deg, rgba(8, 24, 32, 0.42), rgba(8, 24, 32, 0.18)), url(${loginBg})`,
            }}
        >
            <form className="login-card" onSubmit={handleSubmit}>
                <h1>后台管理系统</h1>

                <label className="field">
                    <span>用户名</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="请输入用户名"
                        autoComplete="username"
                    />
                </label>

                <label className="field">
                    <span>密码</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入密码"
                        autoComplete="current-password"
                    />
                </label>

                {error && <p className="form-error">{error}</p>}

                <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? '登录中…' : '登录'}
                </button>

                <p className="demo-hint">
                    演示账号：{DEMO_ACCOUNT.username} / {DEMO_ACCOUNT.password}
                </p>
            </form>
        </div>
    )
}
