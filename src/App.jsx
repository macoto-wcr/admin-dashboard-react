import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import UserList from './pages/UserList.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
    return (
        <HashRouter>
            <Routes>
                {/* 登录页不需要登录就能访问 */}
                <Route path="/login" element={<Login />} />

                {/* 这一层负责拦截：没登录就跳回登录页 */}
                <Route element={<ProtectedRoute />}>
                    {/* 这一层是登录后的公共布局：侧边栏 + 顶栏 */}
                    <Route element={<Layout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/users" element={<UserList />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </HashRouter>
    )
}
