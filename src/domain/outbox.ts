type OutboxItem = { id: string; kind: string; payload: unknown; attempts: number };

export function enqueue(box: OutboxItem[], item: Omit<OutboxItem, "attempts">): OutboxItem[] {
  return [...box, { ...item, attempts: 0 }];
}

export async function drain(
  box: OutboxItem[],
  send: (item: OutboxItem) => Promise<void>,
): Promise<OutboxItem[]> {
  const leftover: OutboxItem[] = [];
  for (const item of box) {
    try {
      await send(item);
    } catch {
      leftover.push({ ...item, attempts: item.attempts + 1 });
    }
  }
  return leftover;
}
