// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract O10Identity is ERC721, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.AddressSet;

    struct SchemeItem {
        string SchemeName;
    }
    
    struct AttributeDefinition {
        string AttributeName;
        string AttributeScheme;
        string Alias;
        bool IsRoot;
    }

    struct AttributeRecord {
        bytes32 BindingCommitment;
        bytes32 AssetCommitment;
        string AttributeName;
        int Version;
        uint256 AttributeId;
    }

    struct IssuerDetails {
        address Address;
        string Alias;
    }

    struct Issuer {
        IssuerDetails Details;
        bool IsRegistered;
    
        Counters.Counter DefinitionVersion;
        Counters.Counter AttributeId;
        
        // version => attribute definitions
        mapping(uint256 => AttributeDefinition[]) Definitions;
        
        AttributeRecord[] Attributes;

        mapping(uint256 => AttributeRecord) TokenIdToAttribute;
        mapping(bytes32 => AttributeRecord) AssetCommitmentToAttribute; // For validating that is not burned
        mapping(bytes32 => AttributeRecord) BindingCommitmentToAttribute; // For burning
    }

    constructor(string memory name, string memory symbol) ERC721(name, symbol) public {}

    SchemeItem[] _schemeItems;

    mapping(address => Issuer) _issuers;
    EnumerableSet.AddressSet private _issuerAddresses;

    Counters.Counter private _tokenId;

    function register(string memory aliasName) public {
        address issuerAddr = msg.sender;
        require(!_issuers[issuerAddr].IsRegistered, "Issuer with this address already registered");
        Issuer storage issuer = _issuers[issuerAddr];
        issuer.IsRegistered = true;
        issuer.Details = IssuerDetails({Address: issuerAddr, Alias: aliasName});

        _issuerAddresses.add(issuerAddr);
    }

    function getAllIssuers() view public returns(IssuerDetails[] memory) {
        IssuerDetails[] memory issuerDetails = new IssuerDetails[](_issuerAddresses.length());

        for (uint256 i = 0; i < _issuerAddresses.length(); i++) {
            address addr = _issuerAddresses.at(i);
            issuerDetails[i] = _issuers[addr].Details;
        }

        return issuerDetails;
    }

    function setScheme(AttributeDefinition[] memory definitions) public {
        address issuerAddr = msg.sender;
        require(_issuers[issuerAddr].IsRegistered, "Issuer with this address not registered");
        require(definitions.length > 0, "input arrays must be not empty");

        bool rootFound = false;
        for (uint256 i = 0; i < definitions.length; i++) {
            if (definitions[i].IsRoot) {
                rootFound = true;
            }
        }

        require(rootFound, "No root attribute specified in the scheme");

        _issuers[issuerAddr].DefinitionVersion.increment();
        for (uint256 i = 0; i < definitions.length; i++) {
            _issuers[issuerAddr].Definitions[_issuers[issuerAddr].DefinitionVersion.current()].push(definitions[i]);
        }
    }

    // function setScheme(address issuerAddr, bool[] memory isRoot, string[] memory schemeNames, string[] memory attributeNames, string[] memory aliases) public payable {
    //     require(!_issuers[issuerAddr].IsRegistered, "Issuer with this address not registered");
    //     require(isRoot.length > 0 && schemeNames.length > 0 && attributeNames.length > 0 && aliases.length > 0, "input arrays must be not empty");
    //     require(isRoot.length == schemeNames.length && isRoot.length == attributeNames.length && isRoot.length == aliases.length, "input arrays must be of the same size");

    //     bool rootFound = false;
    //     for (uint256 i = 0; i < isRoot.length; i++) {
    //         if(isRoot[i]) {
    //             rootFound = true;
    //         }
    //     }

    //     require(rootFound, "No root attribute specified in the scheme");

    //     _issuers[issuerAddr].DefinitionVersion.increment();
    //     for (uint256 i = 0; i < isRoot.length; i++) {
    //         _issuers[issuerAddr].Definitions[_issuers[issuerAddr].DefinitionVersion.current()].push(AttributeDefinition({IsRoot: isRoot[i], AttributeScheme: schemeNames[i], AttributeName: attributeNames[i], Alias: aliases[i]}));
    //     }
    // }

    function getScheme(address issuerAddr) view public returns(uint256, AttributeDefinition[] memory) {
        require(_issuers[issuerAddr].IsRegistered, "Issuer with this address not registered");
        require(_issuers[issuerAddr].DefinitionVersion.current() > 0, "Issuer didn't define any scheme yet");

        uint256 idx = _issuers[issuerAddr].DefinitionVersion.current();
        AttributeDefinition[] memory definitions = new AttributeDefinition[](_issuers[issuerAddr].Definitions[idx].length);

        for (uint256 i = 0; i < definitions.length; i++) {
            definitions[i] = _issuers[issuerAddr].Definitions[idx][i];
        }

        return (idx, definitions);
    }

    // function getScheme(address issuerAddr) public payable returns(uint256, bool[] memory, string[] memory, string[] memory, string[] memory) {
    //     require(!_issuers[issuerAddr].IsRegistered, "Issuer with this address not registered");
    //     require(_issuers[issuerAddr].DefinitionVersion.current() > 0, "Issuer didn't define any scheme yet");

    //     uint256 idx = _issuers[issuerAddr].DefinitionVersion.current();
    //     AttributeDefinition[] storage definitions = _issuers[issuerAddr].Definitions[idx];

    //     bool[] memory isRoot = new bool[](definitions.length);
    //     string[] memory schemeNames = new string[](definitions.length);
    //     string[] memory attributeNames = new string[](definitions.length);
    //     string[] memory attributeAliases = new string[](definitions.length);

    //     for (uint256 i = 0; i < definitions.length; i++) {
    //         isRoot[i] = definitions[i].IsRoot;
    //         schemeNames[i] = definitions[i].AttributeScheme;
    //         attributeNames[i] = definitions[i].AttributeName;
    //         attributeAliases[i] = definitions[i].Alias;
    //     }

    //     return (idx, isRoot, schemeNames, attributeNames, attributeAliases);
    // }

    function issueAttributes(AttributeRecord[] memory attributeRecords) public {
        address issuerAddr = msg.sender;
        require(_issuers[issuerAddr].IsRegistered, "Issuer with this address not registered");
        require(_issuers[issuerAddr].DefinitionVersion.current() > 0, "Issuer didn't define any scheme yet");

        uint256 idx = _issuers[issuerAddr].DefinitionVersion.current();
        AttributeDefinition[] memory definitions = new AttributeDefinition[](_issuers[issuerAddr].Definitions[idx].length);

        for (uint256 i = 0; i < definitions.length; i++) {
            bool found = false;

            for (uint256 j = 0; j < attributeRecords.length; j++) {
                if(keccak256(abi.encodePacked(attributeRecords[j].AttributeName)) == keccak256(abi.encodePacked(definitions[i].AttributeName))) {
                    found = true;
                }
            }

            require(found, "Requested attributes does not match the current scheme of the issuer");
        }

        for (uint256 i = 0; i < attributeRecords.length; i++) {
            _issuers[issuerAddr].AttributeId.increment();

            if(_issuers[issuerAddr].BindingCommitmentToAttribute[attributeRecords[i].BindingCommitment].AttributeId > 0) {
                _burn(_issuers[issuerAddr].BindingCommitmentToAttribute[attributeRecords[i].BindingCommitment].AttributeId);
            }

            uint256 attributeId = _issuers[issuerAddr].AttributeId.current();

            attributeRecords[i].AttributeId = attributeId;
            _issuers[issuerAddr].Attributes.push(attributeRecords[i]);
            _issuers[issuerAddr].TokenIdToAttribute[attributeId] = attributeRecords[i];
            _issuers[issuerAddr].AssetCommitmentToAttribute[attributeRecords[i].AssetCommitment] = attributeRecords[i];
            _issuers[issuerAddr].BindingCommitmentToAttribute[attributeRecords[i].BindingCommitment] = attributeRecords[i];

            _mint(issuerAddr, attributeId);
        }

    }
}