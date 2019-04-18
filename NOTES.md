Ganache CLI v6.4.3 (ganache-core: 2.5.5)

Available Accounts
==================
(0) 0xe0615efcedf7943fbdaa11071242c3662d774f6c (~100 ETH) Customer
(1) 0x5bb6647dcf8c437d9b96649cd9f969113c28e53c (~100 ETH) Supplier
(2) 0xffd4ed170d65731428f11c22c734225737ce27cd (~100 ETH)
(3) 0x0093c8eebd608af3f581f053cb93f345532659b3 (~100 ETH)
(4) 0xfa44cb2439dca38358dc91c455c76fe0c9a55632 (~100 ETH)
(5) 0x8ab508716428dbf48a5177ebeb8f9152bad811a5 (~100 ETH)
(6) 0xb67742ea9c2626e48910a773a4a4f1b4af1ad4eb (~100 ETH)
(7) 0x4c788fc3e8e4ed77b684b47337707629af531f77 (~100 ETH)
(8) 0x9b7b3db12171ab4f7da501e47e2a796aff5c1e1b (~100 ETH)
(9) 0xf254acff7ffbc2ad00e518ee0f29a7abb4e65de7 (~100 ETH)

Private Keys
==================
(0) 0x7122ce5681aa15a90056d2fd5806fde08f34882082148b55f354f57d386b8f2e
(1) 0x214e7968a04305a62262686a9725f93ea12fa0564dd853357725c262b74c7309
(2) 0xfa0b7ee1f5a73f0e8b33b9d7d5ed893aa8c3dba281032b1afa7a0eb240908e5f
(3) 0xb6446d803ec47e0bfbe65573923bfd3758b7dacd4d74889a0d9e7dcadfd6c957
(4) 0x7e276fe692cae825a9a8b176dcf3806bd06e09991a726983bfac6235159aa529
(5) 0x3070a6e22461458906493e559644c4fc47954c3a323313e1bd5cc92972df2acc
(6) 0x483647f3f1209f454680330cb2965803186d432be0497b51c97480ef0cc870c0
(7) 0x4caab76422f027c2fe83e338b538bdf4d0385b651594ffb3b672bdc46d0996c5
(8) 0x2f79ed0179ee25f3d9ebefdf8090ad39d4f44b95a36b6afd112f4ae526b6d2b0
(9) 0xd48b173885b0ffd441d21526c5f03e8f334bd15394427c2d9fc93b9fa2c54b5f

HD Wallet
==================
Mnemonic:      loan sudden reopen please label damage impose method time tag resemble foam
Base HD Path:  m/44'/60'/0'/0/{account_index}

Gas Price
==================
20000000000

Gas Limit
==================
6721975


# created registry

{"address":"0x706bbbf8bf4700ea38999d5a2db690a4e6e62bca","gas":720563,"repoId":"5cb5c8661d6b8b4a3eef1c4e"}

# binding policy

{"address":"0x5406afad04ddb93c54a16f9b2f931f00257657f6","gas":371325,"repoId":"5cb5c8971d6b8b4a3eef1c4f"}

POLICY CONTRACTS GENERATED AND COMPILED SUCCESSFULLY
Policy CREATED and RUNNING at 0x5406afad04ddb93c54a16f9b2f931f00257657f6
GAS USED:  371325
Policy Id:  5cb5c8971d6b8b4a3eef1c4f
Role's indexes:  Map {
  'Customer' => 1,
  'Supplier' => 2,
  'Candidate' => 3,
  'Carrier' => 4,
  'Invoicer' => 5,
  'Invoicee' => 6 }


# goods shipment

{"id":"5cb5c92a1d6b8b4a3eef1c51","name":"Goods_Shipement"

# invoice handling

{"id":"5cb5c99c1d6b8b4a3eef1c52","name":"Invoice_Handling",

# order to cash

{ id: 5cb5ca071d6b8b4a3eef1c53, name: 'Order_To_Cash' }


# task-role

policyId: "5cb5c8971d6b8b4a3eef1c4f"
rootProc: "5cb5ca071d6b8b4a3eef1c53"

{"address":"0xe04130d5f47f2f2c13de231571ff19c204b02e17","gas":249092,"repoId":"5cb5ca7f1d6b8b4a3eef1c54"}

# created instance

http://localhost:3000/models/5cb5ca071d6b8b4a3eef1c53

caseCreator: "0xe0615efcedf7943fbdaa11071242c3662d774f6c"
creatorRole: "Customer"

{"address":"0x540c1a370191137a8ebfebf14291310c4ab1f033","gas":1087023,"runtimeAddress":"0x26992cfb014465925ad979a20b7682ac82b3a44d","runtimeGas":1371352,"transactionHash":"0x72437277a9302fe69a23f87059665fcdaf806bd59ed7a753578119afba184ec8"}


nominated supplier

nominator: "0xe0615efcedf7943fbdaa11071242c3662d774f6c"
nominee: "0x5bb6647dcf8c437d9b96649cd9f969113c28e53c"
pCase: "0x540c1a370191137a8ebfebf14291310c4ab1f033"
rNominator: "Customer"
rNominee: "Supplier"
