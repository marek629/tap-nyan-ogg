export const chunkTypedArray = ({ bitDepth, float, signed }) => {
  if (float) {
    if (signed) {
      switch (bitDepth) {
        case 32:
          return Float32Array
        case 64:
          return Float64Array
        default:
          throw new Error('Unsupported float bit depth!')
      }
    }
  }
  if (signed) {
    switch (bitDepth) {
      case 8:
        return Int8Array
      case 16:
        return Int16Array
      case 32:
        return Int32Array
      case 64:
        return BigInt64Array
      default:
        throw new Error('Unsupported signed integer bit depth!')
    }
  }
  switch (bitDepth) {
    case 8:
      return Uint8Array
    case 16:
      return Uint16Array
    case 32:
      return Uint32Array
    case 64:
      return BigUint64Array
    default:
      throw new Error('Unsupported unsigned integer bit depth!')
  }
}
