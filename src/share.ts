import { del as blobDel, head as blobHead, put as blobPut, get as blobGet } from '@vercel/blob';

const BASE_DIR = 'shares';

export function shareKey(id: string) {
  return `${BASE_DIR}/${id}.json`;
}

export async function put(id: string, body: string) {
  const key = shareKey(id);
  const res = await blobPut(key, body, { access: 'public' });
  return { key, url: res.url };
}

export async function get(id: string): Promise<string | null> {
  const { body } = await blobGet(shareKey(id));
  if (!body) return null;
  return await body.text();
}

export async function head(id: string) {
  try {
    const h = await blobHead(shareKey(id));
    return h;
  } catch (_e) {
    return null;
  }
}

export async function del(id: string) {
  await blobDel(shareKey(id));
}