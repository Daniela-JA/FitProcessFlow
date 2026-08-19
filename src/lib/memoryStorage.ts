type MemoryStore = Map<string, string>;

const memory: MemoryStore = new Map();

export const memoryStorage = {
  getItem: async (name: string) => memory.get(name) ?? null,
  setItem: async (name: string, value: string) => {
    memory.set(name, value);
  },
  removeItem: async (name: string) => {
    memory.delete(name);
  },
  clear: () => memory.clear(),
};

export async function getJson<T>(key: string): Promise<T | null> {
  const raw = await memoryStorage.getItem(key);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

export async function setJson(key: string, value: unknown): Promise<void> {
  await memoryStorage.setItem(key, JSON.stringify(value));
}
