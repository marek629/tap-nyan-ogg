export const radianFromSampleNumber = ({
  sampling,
  frequency,
  number,
}) => (2 * number * frequency * Math.PI) / sampling