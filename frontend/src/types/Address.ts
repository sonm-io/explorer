export class Address {
    constructor(name: string, address: string) {
        this.name = name;
        this.address = address;
    }

    public address: string;
    public name: string;
}

const definedAddresses = {
    "0x23e808e6ef115832f79bf38ab317fe49e981add3": new Address("SNM token", "0x23e808e6ef115832f79bf38ab317fe49e981add3"),
    "0xb61a2c724f89a223c02d2834a8a22c337ea67c67": new Address("Gate members", "0xb61a2c724f89a223c02d2834a8a22c337ea67c67"),
    "0x1925b47c97c846d6ac31b31ae7a505e39ec56a69": new Address("Gatekeeper", "0x1925b47c97c846d6ac31b31ae7a505e39ec56a69"),
    "0x082f19a4efcfc5e3ca83f498362be9696978c879": new Address("Migration management ", "0x082f19a4efcfc5e3ca83f498362be9696978c879"),
    "0x540eeffa179382dec38883a6776d22030acdc2ed": new Address("Oracle members", "0x540eeffa179382dec38883a6776d22030acdc2ed"),
    "0x68a5624428fab709c311cd7a6938f73f02b132e1": new Address("Profile registry", "0x68a5624428fab709c311cd7a6938f73f02b132e1"),
    "0x6f949f594b7a0773ba3e445b7957b390b45ac53e": new Address("Blacklist", "0x6f949f594b7a0773ba3e445b7957b390b45ac53e"),
    "0x5dfdf389afca3eff479686a8a141ebcc74151434": new Address("Oracle", "0x5dfdf389afca3eff479686a8a141ebcc74151434"),
    "0x6c88e07debd749476636ac4841063130df6c62bf": new Address("Market", "0x6c88e07debd749476636ac4841063130df6c62bf"),
    "0xc3acff8854f16ce6857b6c7f54c4b143bc3cb60f": new Address("DeployList", "0xc3acff8854f16ce6857b6c7f54c4b143bc3cb60f"),
    "0xd1a6f3d1ae33b4b19565a6b283d7a05c5a0decb0": new Address("AddressHashMap", "0xd1a6f3d1ae33b4b19565a6b283d7a05c5a0decb0"),
};

const definedAddressesMap: Address[] = [];

Object.keys(definedAddresses).forEach((key) => {
    const value = definedAddresses[key];
    definedAddressesMap.push(value);
});

export {definedAddresses, definedAddressesMap};
