export const radianFromSampleNumber = ({ sampling, frequency, number }) =>
  (2 * number * frequency * Math.PI) / sampling

export class LowFrequencyOscilator {
  #sampling = 44_100
  #frequency = 20

  constructor({ sampling, frequency }) {
    this.#sampling = sampling
    this.#frequency = frequency
  }

  at(n) {
    return Math.sin(
      radianFromSampleNumber({
        sampling: this.#sampling,
        frequency: this.#frequency,
        number: n,
      }),
    )
  }
}
