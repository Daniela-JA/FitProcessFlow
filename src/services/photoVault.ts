import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "fpf.photo.";

export async function saveProgressPhoto(id: string, uri: string): Promise<string> {
  await AsyncStorage.setItem(PREFIX + id, uri);
  return uri;
}

export async function loadProgressPhoto(id: string): Promise<string | null> {
  return AsyncStorage.getItem(PREFIX + id);
}
