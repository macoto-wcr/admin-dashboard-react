import { useState } from 'react'

// 通用确认弹窗：删除这类"不可撤销"的操作，先问一句再做
//   title / message：标题和说明文字
//   confirmText / cancelText：两个按钮的文字
//   danger：确认按钮是否用红色（危险操作）
//   onConfirm：点"确认"时执行，可以是 async 函数；抛错会显示在弹窗里
//   onClose：点"取消"或遮罩时，由父组件关闭弹窗
export default function ConfirmDialog({
    title = '确认操作',
    message,
    confirmText = '确定',
    cancelText = '取消',
    danger = false,
    onConfirm,
    onClose,
}) {
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')

    async function handleConfirm() {
        setBusy(true)
        setError('')
        try {
            await onConfirm() // 等父组件的删除请求完成（失败会 throw 到这里）
        } catch (err) {
            setError(err.message || '操作失败，请重试')
        } finally {
            setBusy(false)
        }
    }

    return (
        // 处理中时点遮罩不关闭，防止请求还没回来就把框关了
        <div className="modal-overlay" onClick={busy ? undefined : onClose}>
            <div
                className="modal"
                role="alertdialog"
                aria-modal="true"
                onClick={(event) => event.stopPropagation()}
            >
                <h3 className="modal-title">{title}</h3>
                <p className="modal-message">{message}</p>

                {error && <p className="form-error">{error}</p>}

                <div className="modal-actions">
                    <button type="button" className="btn" onClick={onClose} disabled={busy}>
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={danger ? 'btn btn-danger' : 'btn btn-primary'}
                        onClick={handleConfirm}
                        disabled={busy}
                    >
                        {busy ? '处理中…' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
