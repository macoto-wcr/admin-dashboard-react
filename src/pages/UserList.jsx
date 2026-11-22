import { useEffect, useState } from 'react'
import { deleteUser, fetchUsers } from '../api/users.js'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import UserFormModal from '../components/UserFormModal.jsx'

export default function UserList() {
    const PAGE_SIZE = 5
    const [loading, setLoading] = useState(true)
    const [list, setList] = useState([])
    const [total, setTotal] = useState(0)
    const [error, setError] = useState('')
    const [page, setPage] = useState(1)
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    // 只有"第一次进来、还没有任何数据"时才显示整页加载中
    const initialLoading = loading && list.length === 0
    const [keyword, setKeyword] = useState('')

    // 当前打开的是哪个弹窗：null = 都没开
    // { type: 'form', user: null } = 新增；{ type: 'form', user } = 编辑
    const [dialog, setDialog] = useState(null)
    // 每次增删改后 +1，让下面的 useEffect 重新请求数据
    const [refreshKey, setRefreshKey] = useState(0)
    // 正在等待确认删除的用户：null = 没开删除确认框
    const [deleteTarget, setDeleteTarget] = useState(null)


    useEffect(() => {
        let ignore = false
        setLoading(true)

        fetchUsers({ keyword, page, pageSize: PAGE_SIZE })
            .then((data) => {
                if (ignore) return
                const maxPage = Math.max(1, Math.ceil(data.total / PAGE_SIZE))
                if (page > maxPage) {
                    setPage(maxPage)    // 3 > 2 → 把页码改成 2
                    return              // ← 关键：这一次的"空列表"不要用，直接结束
                }
                setList(data.list)
                setTotal(data.total)
                setError('')
            })
            .catch(() => {
                if (!ignore) setError('数据加载失败，请刷新重试')
            })
            .finally(() => {
                if (!ignore) setLoading(false)
            })

        // 组件卸载后不再更新状态，避免"已卸载组件 setState"的警告
        return () => {
            ignore = true
        }
    }, [keyword, page, refreshKey])

    return (
        <section className="card">
            <div className="card-header">
                <h2 className="card-title">用户列表</h2>
                <div className="card-actions">
                    <span className="card-meta">{total} 位用户</span>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setDialog({ type: 'form', user: null })}
                    >
                        新增用户
                    </button>
                </div>
            </div>

            {/* 搜索框永远挂载：放进下面的条件分支里，没结果时会被卸载，焦点就丢了 */}
            <div className="toolbar">
                <input
                    className="search-input"
                    value={keyword}
                    onChange={(e) => {
                        setKeyword(e.target.value)
                        setPage(1)          // 换关键词必须回到第 1 页
                    }}
                    placeholder="搜索姓名或邮箱"
                />
            </div>

            {initialLoading && <p className="state-text">加载中…</p>}
            {error && <p className="form-error">{error}</p>}

            {!initialLoading && !error && (
                <>
                    <div className={loading ? 'table-wrap is-loading' : 'table-wrap'}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>姓名</th>
                                    <th>邮箱</th>
                                    <th>角色</th>
                                    <th>状态</th>
                                    <th>创建时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="state-text">
                                            暂无数据
                                        </td>
                                    </tr>
                                )}
                                {list.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
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
                                        <td>{user.createdAt}</td>
                                        <td>
                                            <div className="row-actions">
                                                {/* 编辑：把当前行 user 交给同一个弹窗，预填 + 走 updateUser */}
                                                <button
                                                    type="button"
                                                    className="btn btn-sm"
                                                    onClick={() =>
                                                        setDialog({ type: 'form', user })
                                                    }
                                                >
                                                    编辑
                                                </button>
                                                {/* 删除：先只记下"要删谁"，弹出确认框，确认后才真删 */}
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger-ghost"
                                                    onClick={() => setDeleteTarget(user)}
                                                >
                                                    删除
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination">
                        <button
                            type="button"
                            disabled={loading || page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            上一页
                        </button>

                        <span>
                            第 {page} / {totalPages} 页
                        </span>

                        <button
                            type="button"
                            disabled={loading || page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            下一页
                        </button>
                    </div>
                </>
            )}

            {dialog?.type === 'form' && (
                <UserFormModal
                    user={dialog.user}
                    onClose={() => setDialog(null)}
                    onSaved={() => {
                        setDialog(null)
                        setRefreshKey((key) => key + 1) // 触发重新请求
                    }}
                />
            )}

            {/* 删除确认框：只有点了某一行的「删除」才出现 */}
            {deleteTarget && (
                <ConfirmDialog
                    title="删除用户"
                    message={`确定要删除「${deleteTarget.name}」吗？此操作不可撤销。`}
                    confirmText="删除"
                    danger
                    onConfirm={async () => {
                        await deleteUser(deleteTarget.id)
                        setDeleteTarget(null)
                        // 删完刷新列表。如果删掉的是某页最后一条，
                        // useEffect 里"页码越界就回退"的逻辑会自动回到上一页
                        setRefreshKey((key) => key + 1)
                    }}
                    onClose={() => setDeleteTarget(null)}
                />
            )}
        </section>
    )
}
