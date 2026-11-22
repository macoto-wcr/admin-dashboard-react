import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getUsername, logout } from '../auth.js'

const PAGE_TITLES = {
    '/dashboard': '概览',
    '/users': '用户管理',
}

export default function Layout() {
    const navigate = useNavigate()
    const location = useLocation()
    const title = PAGE_TITLES[location.pathname] || '后台管理系统'

    function handleLogout() {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <div className="brand">Admin 后台</div>

                <nav className="side-nav">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive ? 'nav-item active' : 'nav-item'
                        }
                    >
                        概览
                    </NavLink>
                    <NavLink
                        to="/users"
                        className={({ isActive }) =>
                            isActive ? 'nav-item active' : 'nav-item'
                        }
                    >
                        用户管理
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <span className="current-user">{getUsername()}</span>
                    <button type="button" className="link-button" onClick={handleLogout}>
                        退出登录
                    </button>
                </div>
            </aside>

            <div className="main">
                <header className="topbar">
                    <h1>{title}</h1>
                </header>

                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
