import { promises as fs } from 'fs';
import path from 'path';

const STORAGE_FILE = path.join(process.cwd(), 'magic-links.json');

interface MagicLinkData {
  email: string;
  expires: number;
}

interface MagicLinksStorage {
  [token: string]: MagicLinkData;
}

// Read magic links from file
async function readMagicLinks(): Promise<MagicLinksStorage> {
  try {
    const data = await fs.readFile(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is invalid, return empty object
    return {};
  }
}

// Write magic links to file
async function writeMagicLinks(links: MagicLinksStorage): Promise<void> {
  await fs.writeFile(STORAGE_FILE, JSON.stringify(links, null, 2));
}

// Clean up expired tokens
async function cleanupExpiredTokens(links: MagicLinksStorage): Promise<MagicLinksStorage> {
  const now = Date.now();
  const cleaned: MagicLinksStorage = {};
  
  for (const [token, data] of Object.entries(links)) {
    if (data.expires > now) {
      cleaned[token] = data;
    }
  }
  
  return cleaned;
}

export const magicLinks = {
  async set(token: string, data: MagicLinkData): Promise<void> {
    const links = await readMagicLinks();
    links[token] = data;
    await writeMagicLinks(links);
  },

  async get(token: string): Promise<MagicLinkData | undefined> {
    const links = await readMagicLinks();
    return links[token];
  },

  async delete(token: string): Promise<void> {
    const links = await readMagicLinks();
    delete links[token];
    await writeMagicLinks(links);
  },

  async cleanup(): Promise<void> {
    const links = await readMagicLinks();
    const cleaned = await cleanupExpiredTokens(links);
    await writeMagicLinks(cleaned);
  }
};
