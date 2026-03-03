// Node protocol types — used by the NodeClient to handle agent invoke requests.

/** Incoming invoke request from the server. */
export interface InvokeRequest {
  id: string
  command: string
  paramsJSON: string
  timeoutMs: number
}

/** Result sent back to the server after handling an invoke. */
export interface InvokeResult {
  ok: boolean
  payload?: unknown
  error?: { code: string; message: string }
}

/** A capability group that this node advertises. */
export interface NodeCapability {
  name: string
  commands: string[]
  available: () => boolean
}
