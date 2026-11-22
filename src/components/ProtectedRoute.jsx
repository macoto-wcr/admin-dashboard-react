import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isLoggedIn } from '../auth.js'

// 没登录就跳去登录页；登录了就把子路由渲染出来（<Outlet />）
export default function ProtectedRoute() {
    const location = useLocation()

    if (!isLoggedIn()) {
        // state 记住"你本来想去哪"，登录成功后可以跳回去
        return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }

    return <Outlet />
}
