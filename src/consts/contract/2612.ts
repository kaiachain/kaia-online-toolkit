export default {
  abi: [
    {
      inputs: [
        {
          internalType: 'address',
          name: 'initialOwner',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [],
      name: 'ECDSAInvalidSignature',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'length',
          type: 'uint256',
        },
      ],
      name: 'ECDSAInvalidSignatureLength',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 's',
          type: 'bytes32',
        },
      ],
      name: 'ECDSAInvalidSignatureS',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'allowance',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'needed',
          type: 'uint256',
        },
      ],
      name: 'ERC20InsufficientAllowance',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'balance',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'needed',
          type: 'uint256',
        },
      ],
      name: 'ERC20InsufficientBalance',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'approver',
          type: 'address',
        },
      ],
      name: 'ERC20InvalidApprover',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'receiver',
          type: 'address',
        },
      ],
      name: 'ERC20InvalidReceiver',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'ERC20InvalidSender',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
      ],
      name: 'ERC20InvalidSpender',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'deadline',
          type: 'uint256',
        },
      ],
      name: 'ERC2612ExpiredSignature',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'signer',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'ERC2612InvalidSigner',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'currentNonce',
          type: 'uint256',
        },
      ],
      name: 'InvalidAccountNonce',
      type: 'error',
    },
    {
      inputs: [],
      name: 'InvalidShortString',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'OwnableInvalidOwner',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'OwnableUnauthorizedAccount',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'str',
          type: 'string',
        },
      ],
      name: 'StringTooLong',
      type: 'error',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [],
      name: 'EIP712DomainChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      inputs: [],
      name: 'DOMAIN_SEPARATOR',
      outputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
      ],
      name: 'allowance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'approve',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          internalType: 'uint8',
          name: '',
          type: 'uint8',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'eip712Domain',
      outputs: [
        {
          internalType: 'bytes1',
          name: 'fields',
          type: 'bytes1',
        },
        {
          internalType: 'string',
          name: 'name',
          type: 'string',
        },
        {
          internalType: 'string',
          name: 'version',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: 'chainId',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'verifyingContract',
          type: 'address',
        },
        {
          internalType: 'bytes32',
          name: 'salt',
          type: 'bytes32',
        },
        {
          internalType: 'uint256[]',
          name: 'extensions',
          type: 'uint256[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'mint',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'name',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'nonces',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'deadline',
          type: 'uint256',
        },
        {
          internalType: 'uint8',
          name: 'v',
          type: 'uint8',
        },
        {
          internalType: 'bytes32',
          name: 'r',
          type: 'bytes32',
        },
        {
          internalType: 'bytes32',
          name: 's',
          type: 'bytes32',
        },
      ],
      name: 'permit',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'transfer',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'transferFrom',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  bytecode: '0x608060405234801561001057600080fd5b5060405161271e38038061271e83398101604081905261002f91610223565b6040518060400160405280600c81526020017f5065726d6974546f6b656e00000000000000000000000000000000000000000081525060405180604001604052806001815260200160318152508160405180604001604052806003815260200160504b815250816040518060400160405280600c81526020017f5065726d6974546f6b656e0000000000000000000000000000000000000000008152506100d0838383836100e8565b6100e08282600033610142565b505050610248565b600061010761010284848461020a565b610142565b9050806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505050565b600061014e83836101f2565b6101a1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201526d1499595b9d1c985b9d0818d85b1b60921b604482015260640160405180910390fd5b6101e96101e4836040518060400160405280600181526020017f310000000000000000000000000000000000000000000000000000000000000081525061020a565b82610142565b90505b92915050565b60008183106101ec5781610142565b8261014e565b600082600001805490508210610142565b60008383834630604051602001610225959493929190610248565b604051602081830303815290604052805190602001209050949350505050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061025582610232565b9050919050565b61026581610247565b811461027057600080fd5b50565b600081519050610282816102a4565b92915050565b6000602082840312156102a0576102a461022d565b5b60006102ae84828501610273565b91505092915050565b6102c081610247565b82525050565b6000819050919050565b6102d9816102c6565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561031957808201518184015260208101905061030e565b60008484015250505050565b6000601f19601f8301169050919050565b600061034182610325565b61034b8185610330565b935061035b818560208601610341565b61036481610325565b840191505092915050565b600060a0820190506103846000830188610336565b6103916020830187610336565b61039e6040830186610336565b6103ab60608301856102d0565b6103b860808301846102b7565b9695505050505050565b61024d806103d06000396000f3fe608060405236600a57005b600080fdfea2646970667358221220d9c5f0e8b08a6efa8b748d200f71a4a3c9e8f3f7c8c2e9d9a7c3b1b1b1b1b1b164736f6c63430008160033'
}
