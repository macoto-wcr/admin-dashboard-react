import { useState } from 'react'
import { createUser, updateUser } from '../api/users.js'

// 新增 / 编辑共用的弹窗表单
//   user = null  → 新增（空表单）
//   user = 对象  → 编辑（表单预填，保存走 updateUser）
//
// onClose：点「取消」或遮罩时，由父组件关闭弹窗
// onSaved：保存成功后，由父组件负责关闭弹窗 + 刷新列表
export default function UserFormModal({ user, onClose, onSaved }) {
    const isEdit = Boolean(user)

    // 表单的 4 个字段。用 ?? 是因为新增时 user 是 null，不能直接 user.name
    const [form, setForm] = useState({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? '访客',
        status: user?.status ?? '启用',
    })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    // 统一改某个字段：只会替换这个 key，其他字段不变
    function setField(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    // 校验：姓名必填、邮箱格式正确。返回 true 表示通过
    function validate() {
        const next = {}

        if (!form.name.trim()) {
            next.name = '请输入姓名'
        }
        // 简单的邮箱格式：xxx@yyy.zzz
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            next.email = '请输入正确的邮箱'
        }

        setErrors(next)
        return Object.keys(next).length === 0
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (!validate()) return

        setSubmitting(true)
        try {
            // 新增和编辑，只是调用的接口不同
            if (isEdit) {
                await updateUser(user.id, form)
            } else {
                await createUser(form)
            }
            onSaved() // 成功：交给父组件去关弹窗 + 刷新
        } catch (err) {
            setErrors({ submit: err.message })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        // 点遮罩关闭弹窗
        <div className="modal-overlay" onClick={onClose}>
            {/* stopPropagation：点弹窗内部时，不要触发遮罩的 onClick */}
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                onClick={(event) => event.stopPropagation()}
            >
                <h3 className="modal-title">{isEdit ? '编辑用户' : '新增用户'}</h3>

                {/* noValidate：关掉浏览器自带的校验气泡，改用我们自己的提示 */}
                <form onSubmit={handleSubmit} noValidate>
                    <label className="field">
                        <span>姓名</span>
                        <input
                            value={form.name}
                            onChange={(e) => setField('name', e.target.value)}
                            placeholder="请输入姓名"
                        />
                        {errors.name && <em className="field-error">{errors.name}</em>}
                    </label>

                    <label className="field">
                        <span>邮箱</span>
                        <input
                            value={form.email}
                            onChange={(e) => setField('email', e.target.value)}
                            placeholder="name@example.com"
                        />
                        {errors.email && <em className="field-error">{errors.email}</em>}
                    </label>

                    <div className="field-row">
                        <label className="field">
                            <span>角色</span>
                            <select
                                value={form.role}
                                onChange={(e) => setField('role', e.target.value)}
                            >
                                <option value="管理员">管理员</option>
                                <option value="编辑">编辑</option>
                                <option value="访客">访客</option>
                            </select>
                        </label>

                        <label className="field">
                            <span>状态</span>
                            <select
                                value={form.status}
                                onChange={(e) => setField('status', e.target.value)}
                            >
                                <option value="启用">启用</option>
                                <option value="停用">停用</option>
                            </select>
                        </label>
                    </div>

                    {errors.submit && <p className="form-error">{errors.submit}</p>}

                    <div className="modal-actions">
                        <button type="button" className="btn" onClick={onClose}>
                            取消
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? '保存中…' : '保存'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
