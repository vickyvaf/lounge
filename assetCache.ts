// ponytail: simple IndexedDB cache wrapper for asset fetch & background revalidation

const DB_NAME = "AssetCacheDB";
const DB_VERSION = 1;
const STORE_NAME = "assets";

function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME);
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function getCachedAsset(url: string): Promise<ArrayBuffer | null> {
	try {
		const db = await openDB();
		return new Promise((resolve) => {
			const tx = db.transaction(STORE_NAME, "readonly");
			const store = tx.objectStore(STORE_NAME);
			const request = store.get(url);
			request.onsuccess = () => resolve(request.result || null);
			request.onerror = () => resolve(null);
		});
	} catch {
		return null;
	}
}

export async function setCachedAsset(url: string, data: ArrayBuffer): Promise<void> {
	try {
		const db = await openDB();
		return new Promise((resolve) => {
			const tx = db.transaction(STORE_NAME, "readwrite");
			const store = tx.objectStore(STORE_NAME);
			store.put(data, url);
			tx.oncomplete = () => resolve();
			tx.onerror = () => resolve();
		});
	} catch {
		// Ignore storage errors
	}
}

export async function fetchWithCache(url: string, onProgress?: (loaded: number, total: number) => void): Promise<string> {
	const cachedData = await getCachedAsset(url);

	// Background revalidate & update cache
	const revalidate = async () => {
		try {
			const res = await fetch(url);
			if (res.ok) {
				const buf = await res.arrayBuffer();
				await setCachedAsset(url, buf);
			}
		} catch {
			// Network failure ignored in background revalidation
		}
	};

	if (cachedData) {
		const blob = new Blob([cachedData]);
		const blobUrl = URL.createObjectURL(blob);
		revalidate();
		return blobUrl;
	}

	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);

	const total = Number(res.headers.get("content-length")) || 0;
	let loaded = 0;

	if (res.body && onProgress) {
		const reader = res.body.getReader();
		const chunks: Uint8Array[] = [];
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			if (value) {
				chunks.push(value);
				loaded += value.length;
				onProgress(loaded, total);
			}
		}
		const blob = new Blob(chunks as BlobPart[]);
		const buf = await blob.arrayBuffer();
		await setCachedAsset(url, buf);
		return URL.createObjectURL(blob);
	} else {
		const buf = await res.arrayBuffer();
		await setCachedAsset(url, buf);
		const blob = new Blob([buf]);
		return URL.createObjectURL(blob);
	}
}
