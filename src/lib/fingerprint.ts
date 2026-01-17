'use client';

// Generate a simple device fingerprint for tracking (not blocking)
export async function generateFingerprint(): Promise<string> {
  const components: string[] = [];

  // Screen properties
  components.push(`screen:${window.screen.width}x${window.screen.height}`);
  components.push(`pixelRatio:${window.devicePixelRatio}`);

  // Timezone
  components.push(`tz:${Intl.DateTimeFormat().resolvedOptions().timeZone}`);

  // Language and platform
  components.push(`lang:${navigator.language}`);
  components.push(`platform:${navigator.platform}`);

  // Create hash from components
  const fingerprintString = components.join('|');
  const hash = await hashString(fingerprintString);
  
  return hash;
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  
  if (window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
  }
  
  // Fallback: simple hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}
