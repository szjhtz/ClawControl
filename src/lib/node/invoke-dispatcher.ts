// Invoke dispatcher — routes incoming node.invoke.request commands to handlers.

import type { InvokeRequest, InvokeResult } from './types'
import { handleDeviceStatus } from './handlers/device'
import { handleSystemNotify } from './handlers/notify'
import { handleClipboardRead, handleClipboardWrite } from './handlers/clipboard'

export async function dispatch(request: InvokeRequest): Promise<InvokeResult> {
  let params: Record<string, unknown> = {}
  if (request.paramsJSON) {
    try {
      params = JSON.parse(request.paramsJSON)
    } catch {
      return { ok: false, error: { code: 'INVALID_PARAMS', message: 'Failed to parse paramsJSON' } }
    }
  }

  try {
    switch (request.command) {
      case 'device.status':
        return await handleDeviceStatus()
      case 'system.notify':
        return await handleSystemNotify(params as { title?: string; body?: string })
      case 'clipboard.read':
        return await handleClipboardRead()
      case 'clipboard.write':
        return await handleClipboardWrite(params as { text?: string })
      default:
        return { ok: false, error: { code: 'UNKNOWN_COMMAND', message: `Unknown command: ${request.command}` } }
    }
  } catch (err) {
    return { ok: false, error: { code: 'HANDLER_ERROR', message: (err as Error).message } }
  }
}
