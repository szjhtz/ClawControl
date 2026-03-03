// device.status handler — returns platform info about this device

import type { InvokeResult } from '../types'
import { getDeviceStatus } from '../../platform'

export async function handleDeviceStatus(): Promise<InvokeResult> {
  try {
    const status = await getDeviceStatus()
    return { ok: true, payload: status }
  } catch (err) {
    return {
      ok: false,
      error: { code: 'DEVICE_STATUS_FAILED', message: (err as Error).message }
    }
  }
}
