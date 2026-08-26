const VERSION_KEY = "simpleBible:version"

export function saveSelectedVersion(versionAbbr: string) {
  try {
    localStorage.setItem(VERSION_KEY, versionAbbr)
  } catch {
    /* ignore */
  }
}

export function getSelectedVersion(): string | null {
  try {
    return localStorage.getItem(VERSION_KEY)
  } catch {
    return null
  }
}
