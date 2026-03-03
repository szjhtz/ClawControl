// Capability registry — declares what this node can do, sent during connect handshake.

import type { NodeCapability } from './types'

/** All capabilities this node advertises. */
export function getCapabilities(): NodeCapability[] {
  return [
    {
      name: 'device',
      commands: ['device.status'],
      available: () => true
    },
    {
      name: 'system',
      commands: ['system.notify'],
      available: () => true
    },
    {
      name: 'clipboard',
      commands: ['clipboard.read', 'clipboard.write'],
      available: () => typeof navigator !== 'undefined' && !!navigator.clipboard
    }
  ]
}

/** Flat list of capability group names for the connect handshake. */
export function getCapNames(): string[] {
  return getCapabilities()
    .filter(c => c.available())
    .map(c => c.name)
}

/** Flat list of all commands for the connect handshake. */
export function getCommands(): string[] {
  return getCapabilities()
    .filter(c => c.available())
    .flatMap(c => c.commands)
}

/** Permissions map — grants each command explicitly. */
export function getPermissions(): Record<string, boolean> {
  const perms: Record<string, boolean> = {}
  for (const cmd of getCommands()) {
    perms[cmd] = true
  }
  return perms
}
