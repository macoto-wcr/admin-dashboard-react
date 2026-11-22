import { USERS } from '../api/users.js'

export default function Dashboard() {
    const activeCount = USERS.filter((user) => user.status === '启用').length
    const adminCount = USERS.filter((user) => user.role === '管理员').length

    return (
        <>
            <div className="stat-grid">
                <div className="stat-card">
                    <span className="stat-label">用户总数</span>
                    <strong className="stat-value">{USERS.length}</strong>
                </div>
                <div className="stat-card">
                    <span className="stat-label">已启用</span>
                    <strong className="stat-value">{activeCount}</strong>
                </div>
                <div className="stat-card">
                    <span className="stat-label">管理员</span>
                    <strong className="stat-value">{adminCount}</strong>
                </div>
            </div>

            <section className="card">
                <h2 className="card-title">最近添加的用户</h2>
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>姓名</th>
                                <th>邮箱</th>
                                <th>角色</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {USERS.slice(-5)
                                .reverse()
                                .map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <span
                                                className={
                                                    user.status === '启用'
                                                        ? 'badge badge-on'
                                                        : 'badge badge-off'
                                                }
                                            >
                                                {user.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}
