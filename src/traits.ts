type Trait = "trust" | "courage" | "paradox"

class Traits {
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

const kai = new Traits()

console.log(kai.report())

kai.shift("courage", 1)
console.log("You follow a stranger out into the rain.")
console.log(kai.report())

kai.shift("paradox", 1)
console.log("The van hits 88 and the street turns into 1987.")
console.log(kai.report())

kai.shift("trust", -1)
console.log("Her eye flickers red in the CRT glass. You saw it.")
console.log(kai.report())

console.log(
  kai.atLeast("courage", 1)
    ? "You are braver than you were this morning."
    : "You still want to run.",
)
