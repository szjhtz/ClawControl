// system.notify handler — shows a notification on this device

import type { InvokeResult } from '../types'
import { showNotification } from '../../platform'

export async function handleSystemNotify(params: { title?: string; body?: string }): Promise<InvokeResult> {
  const title = params.title || 'OpenClaw'
  const body = params.body || ''

  try {
    await showNotification(title, body)
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: { code: 'NOTIFY_FAILED', message: (err as Error).message }
    }
  }
}
