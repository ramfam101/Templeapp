// utils/secureStore.ts
import * as SecureStore from 'expo-secure-store';

export async function saveSecureValue(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (e) {
    console.error('Failed to save to secure store', e);
  }
}

export async function getSecureValue(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (e) {
    console.error('Failed to get from secure store', e);
    return null;
  }
}

export async function deleteSecureValue(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (e) {
    console.error('Failed to delete from secure store', e);
  }
}
