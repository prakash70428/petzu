"use client";

/**
 * Prescription photos, scans and lab PDFs are too big for localStorage, so
 * they go in IndexedDB on this device. Nothing here is uploaded anywhere.
 */
const DB_NAME = "petzu-health";
const STORE = "files";

/** Big enough for a phone photo or a scanned PDF, small enough not to fill the browser's quota. */
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const request = run(db.transaction(STORE, mode).objectStore(STORE));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

export async function saveFile(id: string, file: Blob): Promise<void> {
  await withStore("readwrite", (store) => store.put(file, id));
}

export function loadFile(id: string): Promise<Blob | undefined> {
  return withStore<Blob | undefined>("readonly", (store) => store.get(id));
}

export async function deleteFile(id: string): Promise<void> {
  await withStore("readwrite", (store) => store.delete(id));
}
