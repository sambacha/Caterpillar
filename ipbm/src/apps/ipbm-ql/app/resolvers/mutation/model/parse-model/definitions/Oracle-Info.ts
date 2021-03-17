import ParameterInfo from './Parameter-Info'

export default class OracleInfo {
  address: string = null
  functionName: string = null
  functionParameters: Array<ParameterInfo> = new Array()

  constructor (public oracleName: string) {}
}
