export default interface RegistryContract {
    address: string;
    events: any;
    addChildBundleId: ({ parentBundleId, processBundleId: string, nodeIndex: number }: {
        parentBundleId: any;
        processBundleId: any;
        nodeIndex: any;
    }) => (any: any) => Promise<any>;
    allInstances: () => Promise<[string]>;
    bindingPolicyFor: ({ address: string, }: {
        address: any;
    }) => Promise<string>;
    bindingPolicyFromId: ({ procId: string, }: {
        procId: any;
    }) => Promise<string>;
    bundleFor: ({ instance: string, }: {
        instance: any;
    }) => Promise<string>;
    childrenFor: ({ id: string, index: number, }: {
        id: any;
        index: any;
    }) => Promise<string>;
    findRuntimePolicy: ({ address: string, }: {
        address: any;
    }) => Promise<string>;
    newBundleInstanceFor: ({ bundleId, parent, policyOpAddr }: {
        bundleId: any;
        parent: any;
        policyOpAddr: any;
    }) => (any: any) => Promise<any>;
    registerFactory: ({ bundleId, address: string, }: {
        bundleId: any;
        address: any;
    }) => (any: any) => Promise<any>;
    registerWorklist: ({ bundleId, address: string, }: {
        bundleId: any;
        address: any;
    }) => (any: any) => Promise<any>;
    relateProcessToPolicy: ({ bundleId, policyId, roleTaskId: string, }: {
        bundleId: any;
        policyId: any;
        roleTaskId: any;
    }) => (any: any) => Promise<any>;
    taskRoleMapFromId: ({ procId: string, }: {
        procId: any;
    }) => Promise<string>;
    worklistBundleFor: ({ address: string, }: {
        address: any;
    }) => Promise<string>;
}
