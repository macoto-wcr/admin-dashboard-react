import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="not-found">
            <strong>404</strong>
            <p>这个页面不存在</p>
            <Link to="/dashboard" className="primary-button">
                返回首页
            </Link>
        </div>
    )
}
