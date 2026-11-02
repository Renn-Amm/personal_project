export type Trait = "trust" | "courage" | "paradox"

export class Traits {
  private values: Record<Trait, number> = {
    trust: 0,
    courage: 0,
    paradox: 0,
  }

  public shift(trait: Trait, amount: number): void {
    this.values[trait] += amount
  }

  public atLeast(trait: Trait, amount: number): boolean {
    return this.values[trait] >= amount
  }

  public report(): string {
    return `Trust ${this.values.trust} | Courage ${this.values.courage} | Paradox ${this.values.paradox}`
  }
}
