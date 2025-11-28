// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract RealityCapsule is ERC721URIStorage {
    using ECDSA for bytes32;
    address public signer;
    uint256 public nextId = 1;

    struct CapsuleData {
        int16 kMilli;
        uint64 omegaMilli;
        uint64 hriMilli;
        uint64 thetaMilli;
        uint64 phiMilli;
        uint64 timestamp;
    }
    mapping(uint256 => CapsuleData) public data;

    constructor(address _signer) ERC721("Reality Capsule","RCAP") { signer = _signer; }

    function mint(address to, CapsuleData calldata c, string calldata uri, bytes calldata sig) external {
        bytes32 digest = keccak256(
          abi.encodePacked(to,c.kMilli,c.omegaMilli,c.hriMilli,c.thetaMilli,c.phiMilli,c.timestamp,uri)
        ).toEthSignedMessageHash();
        require(digest.recover(sig)==signer, "bad sig");
        uint256 id = nextId++;
        _safeMint(to, id);
        _setTokenURI(id, uri);
        data[id] = c;
    }
}
