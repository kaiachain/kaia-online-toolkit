// ERC-721 (NFT) contract ABI and bytecode
export default {
  abi: [
    // Constructor
    {
      inputs: [
        { internalType: 'string', name: 'name_', type: 'string' },
        { internalType: 'string', name: 'symbol_', type: 'string' },
        { internalType: 'address', name: 'initialOwner', type: 'address' }
      ],
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    // Error types - abbreviated for brevity
    { inputs: [{ internalType: 'address', name: 'sender', type: 'address' }, { internalType: 'uint256', name: 'tokenId', type: 'uint256' }, { internalType: 'address', name: 'owner', type: 'address' }], name: 'ERC721IncorrectOwner', type: 'error' },
    { inputs: [{ internalType: 'address', name: 'operator', type: 'address' }, { internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'ERC721InsufficientApproval', type: 'error' },
    { inputs: [{ internalType: 'address', name: 'approver', type: 'address' }], name: 'ERC721InvalidApprover', type: 'error' },
    { inputs: [{ internalType: 'address', name: 'operator', type: 'address' }], name: 'ERC721InvalidOperator', type: 'error' },
    { inputs: [{ internalType: 'address', name: 'owner', type: 'address' }], name: 'ERC721InvalidOwner', type: 'error' },
    { inputs: [{ internalType: 'address', name: 'receiver', type: 'address' }], name: 'ERC721InvalidReceiver', type: 'error' },
    { inputs: [{ internalType: 'address', name: 'sender', type: 'address' }], name: 'ERC721InvalidSender', type: 'error' },
    { inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'ERC721NonexistentToken', type: 'error' },
    { inputs: [{ internalType: 'address', name: 'owner', type: 'address' }], name: 'OwnableInvalidOwner', type: 'error' },
    { inputs: [{ internalType: 'address', name: 'account', type: 'address' }], name: 'OwnableUnauthorizedAccount', type: 'error' },
    
    // Events
    { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'owner', type: 'address' }, { indexed: true, internalType: 'address', name: 'approved', type: 'address' }, { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'Approval', type: 'event' },
    { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'owner', type: 'address' }, { indexed: true, internalType: 'address', name: 'operator', type: 'address' }, { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' }], name: 'ApprovalForAll', type: 'event' },
    { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' }, { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }], name: 'OwnershipTransferred', type: 'event' },
    { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'from', type: 'address' }, { indexed: true, internalType: 'address', name: 'to', type: 'address' }, { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'Transfer', type: 'event' },
    
    // Core Functions
    { inputs: [{ internalType: 'address', name: 'to', type: 'address' }, { internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'approve', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'address', name: 'owner', type: 'address' }], name: 'balanceOf', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'getApproved', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'address', name: 'owner', type: 'address' }, { internalType: 'address', name: 'operator', type: 'address' }], name: 'isApprovedForAll', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'address', name: 'to', type: 'address' }, { internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'mint', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [], name: 'name', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'owner', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'ownerOf', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'address', name: 'from', type: 'address' }, { internalType: 'address', name: 'to', type: 'address' }, { internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'safeTransferFrom', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'address', name: 'from', type: 'address' }, { internalType: 'address', name: 'to', type: 'address' }, { internalType: 'uint256', name: 'tokenId', type: 'uint256' }, { internalType: 'bytes', name: 'data', type: 'bytes' }], name: 'safeTransferFrom', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'address', name: 'operator', type: 'address' }, { internalType: 'bool', name: 'approved', type: 'bool' }], name: 'setApprovalForAll', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }], name: 'supportsInterface', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'symbol', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'tokenURI', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'address', name: 'from', type: 'address' }, { internalType: 'address', name: 'to', type: 'address' }, { internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'transferFrom', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }], name: 'transferOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' }
  ],
  bytecode: '0x60806040523480156200001157600080fd5b5060405162001c3038038062001c30833981016040819052620000349162000183565b8282816200004283620000a3565b50620000508160200151620000a3565b5050600080546001600160a01b0319166001600160a01b039390931692909217909155506200006f3362000123565b6200007a8162000123565b505050620001f5565b634e487b7160e01b600052604160045260246000fd5b80516200b8d7908290620000b990620001d9565b5060208201516200b8d790620000d190620001d9565b50565b600082601f830112620000e757600080fd5b81516001600160401b03808211156200010457620001046200007f565b604051601f8301601f19908116603f011681019082821181831017156200012f576200012f6200007f565b816040528381526020925086838588010111156200014c57600080fd5b600091505b838210156200017057858201830151818301840152908201906200014e565b600093810190920192909252949350505050565b6000806000606084860312156200019957600080fd5b83516001600160401b0380821115620001b157600080fd5b620001bf87838801620000d5565b94506020860151915080821115620001d657600080fd5b50620001e586828701620000d5565b604086015190935090506001600160a01b03811681146200020557600080fd5b809150509250925092565b611a2a80620002056000396000f3'
}
