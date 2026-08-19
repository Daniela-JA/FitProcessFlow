export type HealthSnapshot = {
  steps: number;
  sleepHours: number;
  cardioMinutes: number;
};

export interface HealthPort {
  getToday(): Promise<HealthSnapshot>;
}

export class MockHealthProvider implements HealthPort {
  constructor(private readonly snapshot: HealthSnapshot = { steps: 7420, sleepHours: 7.4, cardioMinutes: 0 }) {}
  async getToday(): Promise<HealthSnapshot> {
    return this.snapshot;
  }
}
