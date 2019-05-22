export interface ScaleType {
    (d: Object): any,
    range: Function,
    domain: Function,
    ticks: Function,
}

export interface DimensionsType {
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
  height: number
  width: number
  boundedHeight?: number
  boundedWidth?: number
}
