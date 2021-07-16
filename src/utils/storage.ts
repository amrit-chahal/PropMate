export interface SyncStorage {
  userLocations?:UserLocationItems;
}
export interface UserLocationItems extends Array<UserLocationItem> { }
export interface UserLocationItem {
  userLocation: string;
  locationTitle: string;
}

export type SyncStorageKeys = keyof SyncStorage;

export function setUserLocationsInStorage(userLocations: UserLocationItems): Promise<void> {
  const vals: SyncStorage = {
    userLocations
  };

  return new Promise((resolve) => {
    chrome.storage.sync.set(vals, () => {
      resolve();
    });
  });
}

export function getUserLocationsInStorage(): Promise<UserLocationItems> {
  const keys: SyncStorageKeys[] = ['userLocations'];
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, (res: SyncStorage) => {
      resolve(res.userLocations ?? []);
    });
  });
}
