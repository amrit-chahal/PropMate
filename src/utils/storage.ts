export interface SyncStorage {
  userLocations?: string[];
}
export type SyncStorageKeys = keyof SyncStorage;

export function setUserLocationsInStorage(
  userLocations: string[]
): Promise<void> {
  const vals: SyncStorage = {
    userLocations
  };
  return new Promise((resolve) => {
    chrome.storage.sync.set(vals, () => {
      resolve();
    });
  });
}

export function getUserLocationsInStorage(): Promise<string[]> {
  const keys: SyncStorageKeys[] = ['userLocations'];
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, (res: SyncStorage) => {
      resolve(res.userLocations ?? []);
    });
  });
}
