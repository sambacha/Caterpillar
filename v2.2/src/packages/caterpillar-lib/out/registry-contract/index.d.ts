import Web3 from 'web3';
import RegistryContract from './interface';
export { RegistryContract, };
declare const _default: ({ hexToId, web3, }: {
    hexToId: (string: any) => string;
    web3: Web3;
}) => ({ abi, address, }: {
    abi: any;
    address: string;
}) => RegistryContract;
export default _default;
