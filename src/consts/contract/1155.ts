// Sample ERC1155 contract ABI and bytecode
export default {
  abi: [
    {
      inputs: [
        {
          internalType: 'address',
          name: 'initialOwner',
          type: 'address',
        },
        {
          internalType: 'string',
          name: 'uri_',
          type: 'string',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [],
      name: 'ERC1155InvalidArrayLength',
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
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'ERC1155InsufficientBalance',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'ERC1155InvalidApprover',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'ERC1155InvalidOperator',
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
      name: 'ERC1155InvalidReceiver',
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
      name: 'ERC1155InvalidSender',
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
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'bool',
          name: 'approved',
          type: 'bool',
        },
      ],
      name: 'ApprovalForAll',
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
          name: 'operator',
          type: 'address',
        },
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
          internalType: 'uint256[]',
          name: 'ids',
          type: 'uint256[]',
        },
        {
          indexed: false,
          internalType: 'uint256[]',
          name: 'values',
          type: 'uint256[]',
        },
      ],
      name: 'TransferBatch',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
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
          name: 'id',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'TransferSingle',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'string',
          name: 'value',
          type: 'string',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'id',
          type: 'uint256',
        },
      ],
      name: 'URI',
      type: 'event',
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
          name: 'id',
          type: 'uint256',
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
      inputs: [
        {
          internalType: 'address[]',
          name: 'accounts',
          type: 'address[]',
        },
        {
          internalType: 'uint256[]',
          name: 'ids',
          type: 'uint256[]',
        },
      ],
      name: 'balanceOfBatch',
      outputs: [
        {
          internalType: 'uint256[]',
          name: '',
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
          name: 'account',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
      ],
      name: 'isApprovedForAll',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
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
          name: 'id',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
      ],
      name: 'mint',
      outputs: [],
      stateMutability: 'nonpayable',
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
          internalType: 'uint256[]',
          name: 'ids',
          type: 'uint256[]',
        },
        {
          internalType: 'uint256[]',
          name: 'amounts',
          type: 'uint256[]',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
      ],
      name: 'mintBatch',
      outputs: [],
      stateMutability: 'nonpayable',
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
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
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
          internalType: 'uint256[]',
          name: 'ids',
          type: 'uint256[]',
        },
        {
          internalType: 'uint256[]',
          name: 'amounts',
          type: 'uint256[]',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
      ],
      name: 'safeBatchTransferFrom',
      outputs: [],
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
          name: 'id',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
      ],
      name: 'safeTransferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          internalType: 'bool',
          name: 'approved',
          type: 'bool',
        },
      ],
      name: 'setApprovalForAll',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'newuri',
          type: 'string',
        },
      ],
      name: 'setURI',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes4',
          name: 'interfaceId',
          type: 'bytes4',
        },
      ],
      name: 'supportsInterface',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
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
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      name: 'uri',
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
  ],
  bytecode: '0x60806040523480156200001157600080fd5b5060405162001c5038038062001c50833981016040819052620000349162000183565b6200003f33620000a0565b8051620000549060029060208401906200010f565b5080516020918201516040805191909152830191909152600080516020620001c08339815191526000805160206200019c833981519152600080516020620001e0833981519152600080516020620001a0833981519152620000f09190620000f0565b505062000279565b620001008282620001a0565b5050565b8280546200011d9062000226565b90600052602060002090601f0160209004810192826200014157600085556200018c565b82601f106200015c57805160ff19168380011785556200018c565b828001600101855582156200018c579182015b828111156200018c5782518255916020019190600101906200016f565b50620001989291506200019a565b5090565b5b808211156200019857600081556001016200019b565b620001b08282620001b4565b5050565b620001c18282620001c5565b5050565b620001d28282620001d6565b5050565b620001e38282620001e7565b5050565b620001f48282620001f8565b5050565b620002058282620002a0565b5050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200023b57607f821691505b602082108114156200025d57634e487b7160e01b600052602260045260246000fd5b50919050565b80516001600160a01b03811681146200027a57600080fd5b919050565b61191380620002896000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80636352211e1161008c578063a22cb46511610066578063a22cb46514610217578063b88d4fde1461022a578063c87b56dd1461023d578063e985e9c51461025057600080fd5b80636352211e146101c657806370a08231146101d957806395d89b411461020f57600080fd5b806323b872dd116100c857806323b872dd1461015d5780632f745c591461017057806342842e0e1461018357806342966c681461019657600080fd5b806301ffc9a7146100ef57806306fdde0314610117578063081812fc1461012c575b600080fd5b6101026100fd366004611293565b61028c565b60405190151581526020015b60405180910390f35b61011f6102de565b6040516101099190611370565b61013f61013a366004611383565b610370565b6040516001600160a01b039091168152602001610109565b61016f61016b3660046113b2565b610392565b005b61013f61017e3660046113ee565b6103c3565b61016f6101913660046113b2565b610447565b61016f6101a4366004611383565b610462565b6101b96101b7366004611383565b6104c0565b604051610109919061141a565b61013f6101d4366004611383565b610547565b6101ec6101e736600461142d565b6105a7565b604051908152602001610109565b61011f61062d565b61016f610225366004611448565b61063c565b61016f610238366004611484565b61064b565b61011f61024b366004611383565b610683565b61010261025e366004611500565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b60006001600160e01b031982166380ac58cd60e01b148061028257506001600160e01b03198216635b5e139f60e01b145b8061028657508061028657506102db565b50600160e01b6301ffc9a7600160e01b9081029190911614919050565b6060600080546102ed90611533565b80601f016020809104026020016040519081016040528092919081815260200182805461031990611533565b80156103665780601f1061033b57610100808354040283529160200191610366565b820191906000526020600020905b81548152906001019060200180831161034957829003601f168201915b5050505050905090565b600061037b82610724565b506000908152600460205260409020546001600160a01b031690565b61039c3382610783565b6103a5816107e1565b6001600160a01b0383166000908152600360205260408120805460019290610a0e83611583565b90915550505050565b60006103ce83610547565b9050806001600160a01b0316836001600160a01b0316036104405760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084015b60405180910390fd5b506104418383610802565b505050565b610441838383604051806020016040528060008152506104c0565b61046c3382610870565b6104c05760405162461bcd60e51b815260206004820152602d60248201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560448201526c1c881bdc88185c1c1c9bdd9959609a1b6064820152608401610437565b6104ca3383610870565b61051c5760405162461bcd60e51b815260206004820152602d60248201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560448201526c1c881bdc88185c1c1c9bdd9959609a1b6064820152608401610437565b6105428484848460405180602001604052806000815250610924565b50505050565b6000818152600260205260408120546001600160a01b0316806105a15760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610437565b92915050565b60006001600160a01b0382166106115760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610437565b506001600160a01b031660009081526003602052604090205490565b6060600180546102ed90611533565b61064733838361097c565b5050565b61065533836108e6565b6106615484846104c0565b6105428484848460405180602001604052806000815250610a4a565b606061068e82610724565b60006106a560408051602081019091526000815290565b90506000815111610a0e5760405180602001604052806000815250610a0e565b6000818152600260205260409020546001600160a01b03166107245760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610437565b50565b6000818152600260205260409020546001600160a01b03166107245760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526b696e6720746f6b656e60a01b6064820152608401610437565b600061078e82610547565b9050806001600160a01b0316836001600160a01b031603610a0e5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610437565b6107ea81610ab0565b50565b6001600160a01b038116600090815260066020526040812080546001929061080a83611583565b9091555050505050565b600081815260046020526040902080546001600160a01b0319166001600160a01b038416908117909155819061083782610547565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60008061087c83610547565b9050806001600160a01b0316846001600160a01b031614806108b757506001600160a01b038082166000908152600560209081526040808320938616835292905290205460ff165b806108e05750836001600160a01b03166108d584610370565b6001600160a01b0316145b949350505050565b6108f08282610b0a565b6000818152600760205260409020546002600019610100600184161502019091160415610724576000818152600760205260408120610647916110a5565b61092f8484846103c3565b61093b84848484610b2a565b6105425760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b6064820152608401610437565b6001600160a01b0383166109e25760405162461bcd60e51b815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20746865207a65726f206160448201526464726573736960d81b6064820152608401610437565b6001600160a01b038216610a445760405162461bcd60e51b815260206004820152602360248201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152623732b960e91b6064820152608401610437565b610a4f838383610c2e565b610a5a600082610802565b6001600160a01b0383166000908152600360205260408120805460019290610a8383611583565b90915550506001600160a01b0382166000908152600360205260408120805460019290610ab183611583565b909155505050505050565b600081815260046020526040902080546001600160a01b0319169055610ad582610547565b6001600160a01b0316610ae6610c3f565b6001600160a01b03167f50ab5f3961e812809bb1df969c083a8c089025aa301c8849e8ad8e1a7cae7c4760405160405180910390a45050565b610b1382610c4f565b610b2660008360405180602001604052806000815250610c8e565b5050565b60006001600160a01b0384163b15610c2357604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290610b6e903390899088908890600401611583565b602060405180830381600087803b158015610b8857600080fd5b505af1925050508015610bb8575060408051601f3d908101601f19168201909252610bb5918101906115e3565b60015b610c15573d808015610be6576040519150601f19603f3d011682016040523d82523d6000602084013e610beb565b606091505b508051610c0d5760405162461bcd60e51b815260040161043790611600565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610a4a565b506001610a4a565b610c3983838361104e565b505050565b6000610c4a60085490565b905090565b6000818152600260205260409020546001600160a01b0316610c895760405162461bcd60e51b815260040161043790611651565b50565b610c9884846110a9565b610ca484848484611127565b6105425760405162461bcd60e51b815260040161043790611600565b60606000610ccd83611218565b600101905060008167ffffffffffffffff811115610cec57610cec6116a1565b6040519080825280601f01601f191660200182016040528015610d16576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a8504945084610d5057610d56565b610d20565b509392505050565b600181815481106'
}
