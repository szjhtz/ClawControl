// clipboard.read / clipboard.write handlers

import type { InvokeResult } from '../types'
import { clipboardRead, clipboardWrite } from '../../platform'

export async function handleClipboardRead(): Promise<InvokeResult> {
  try {
    const text = await clipboardRead()
    return { ok: true, payload: { text } }
  } catch (err) {
    return {
      ok: false,
      error: { code: 'CLIPBOARD_READ_FAILED', message: (err as Error).message }
    }
  }
}

export async function handleClipboardWrite(params: { text?: string }): Promise<InvokeResult> {
  if (typeof params.text !== 'string') {
    return { ok: false, error: { code: 'INVALID_PARAMS', message: 'text is required' } }
  }

  try {
    await clipboardWrite(params.text)
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: { code: 'CLIPBOARD_WRITE_FAILED', message: (err as Error).message }
    }
  }
}
