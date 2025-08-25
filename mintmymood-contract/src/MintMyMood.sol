// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintMyMood is ERC721, Ownable {
    
    uint256 private _tokenIdCounter;
    uint256 public streakMilestone;
    uint256 public moodMaestroMilestone;
    mapping(address => uint256) public streakCount;
    mapping(address => uint256) public lastMintTimestamp;
    mapping(address => bool) public hasFirstMintBadge;
    mapping(address => bool) public hasStreakBadge;
    mapping(address => bool) public hasMoodMaestroBadge;
    mapping(address => uint256) public userMintCount;
    mapping(uint256 => string) public moodMetadata;
    mapping(address => mapping(string => uint256)) public userMoodCounts;

    struct MoodType {
        string name;
        string category;
    }
    MoodType[] public moodTypes;
    uint256 constant DAY = 1 days;

    string public firstMintBadgeURI;
    string public streakBadgeURI;
    string public moodMaestroBadgeURI;

    event Minted(address indexed user, uint256 tokenId, string metadataURI, string moodType);
    event MoodTypeAdded(string moodType, string category);
    event MilestoneBadgeAwarded(address indexed user, string badgeType);

    constructor(address admin, MoodType[] memory initialMoodTypes, uint256 initialStreakMilestone, uint256 initialMoodMaestroMilestone)
        ERC721("MintMyMood", "MOOD")
        Ownable(admin)
    {
        streakMilestone = initialStreakMilestone;
        moodMaestroMilestone = initialMoodMaestroMilestone;
        for (uint256 i = 0; i < initialMoodTypes.length; i++) {
            moodTypes.push(initialMoodTypes[i]);
        }
    }

    function setBadgeURIs(
        string memory _firstMintBadgeURI,
        string memory _streakBadgeURI,
        string memory _moodMaestroBadgeURI
    ) external onlyOwner {
        firstMintBadgeURI = _firstMintBadgeURI;
        streakBadgeURI = _streakBadgeURI;
        moodMaestroBadgeURI = _moodMaestroBadgeURI;
    }

    function addMoodType(string memory newMoodType, string memory category) external onlyOwner {
        require(bytes(newMoodType).length > 0, "Invalid mood type");
        require(bytes(category).length > 0, "Invalid category");
        for (uint256 i = 0; i < moodTypes.length; i++) {
            require(keccak256(bytes(moodTypes[i].name)) != keccak256(bytes(newMoodType)), "Mood type exists");
        }
        moodTypes.push(MoodType(newMoodType, category));
        emit MoodTypeAdded(newMoodType, category);
    }

    function updateStreakMilestone(uint256 newMilestone) external onlyOwner {
        require(newMilestone > 0, "Invalid milestone");
        streakMilestone = newMilestone;
    }

    function updateMoodMaestroMilestone(uint256 newMilestone) external onlyOwner {
        require(newMilestone > 0, "Invalid milestone");
        moodMaestroMilestone = newMilestone;
    }

    function mintMood(string memory metadataURI, string memory moodType) external {
        require(bytes(metadataURI).length > 0, "Invalid metadata URI");
        bool moodExists = false;
        for (uint256 i = 0; i < moodTypes.length; i++) {
            if (keccak256(bytes(moodTypes[i].name)) == keccak256(bytes(moodType))) {
                moodExists = true;
                break;
            }
        }
        require(moodExists, "Invalid mood type");

        if (block.timestamp >= lastMintTimestamp[msg.sender] + DAY) {
            if (block.timestamp < lastMintTimestamp[msg.sender] + 2 * DAY) {
                streakCount[msg.sender]++;
            } else {
                streakCount[msg.sender] = 1;
            }
            lastMintTimestamp[msg.sender] = block.timestamp;
        }

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        moodMetadata[tokenId] = metadataURI;
        userMoodCounts[msg.sender][moodType]++;
        userMintCount[msg.sender]++;
        _safeMint(msg.sender, tokenId);
        emit Minted(msg.sender, tokenId, metadataURI, moodType);
        
        // --- REMOVED ---
        // All automatic badge minting logic has been removed from this function.
        // Users now call the specific mintBadge...() functions to claim their badge.
    }

    // +++ ADDED: Functions for users to claim their badges +++

    function mintFirstMintBadge() external {
        require(userMintCount[msg.sender] >= 1, "Not eligible for first mint badge");
        require(!hasFirstMintBadge[msg.sender], "First mint badge already claimed");
        require(bytes(firstMintBadgeURI).length > 0, "Badge URI not set by owner");

        _tokenIdCounter++;
        uint256 badgeId = _tokenIdCounter;
        moodMetadata[badgeId] = firstMintBadgeURI;
        _safeMint(msg.sender, badgeId);
        hasFirstMintBadge[msg.sender] = true;
        emit MilestoneBadgeAwarded(msg.sender, "First Mint");
    }

    function mintStreakBadge() external {
        require(streakCount[msg.sender] >= streakMilestone, "Streak milestone not reached");
        require(!hasStreakBadge[msg.sender], "Streak badge already claimed");
        require(bytes(streakBadgeURI).length > 0, "Badge URI not set by owner");

        _tokenIdCounter++;
        uint256 badgeId = _tokenIdCounter;
        moodMetadata[badgeId] = streakBadgeURI;
        _safeMint(msg.sender, badgeId);
        hasStreakBadge[msg.sender] = true;
        emit MilestoneBadgeAwarded(msg.sender, string.concat(uint2str(streakMilestone), "-Day Streaker"));
    }

    function mintMoodMaestroBadge() external {
        require(userMintCount[msg.sender] >= moodMaestroMilestone, "Mood Maestro milestone not reached");
        require(!hasMoodMaestroBadge[msg.sender], "Mood Maestro badge already claimed");
        require(bytes(moodMaestroBadgeURI).length > 0, "Badge URI not set by owner");

        _tokenIdCounter++;
        uint256 badgeId = _tokenIdCounter;
        moodMetadata[badgeId] = moodMaestroBadgeURI;
        _safeMint(msg.sender, badgeId);
        hasMoodMaestroBadge[msg.sender] = true;
        emit MilestoneBadgeAwarded(msg.sender, "MoodMaestroMilestone");
    }

    // --- UPDATED: Soulbound check now uses the badge URIs for consistency ---
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        string memory metadata = moodMetadata[tokenId];
        
        bool isFirstMintBadge = bytes(firstMintBadgeURI).length > 0 && keccak256(bytes(metadata)) == keccak256(bytes(firstMintBadgeURI));
        bool isStreakBadge = bytes(streakBadgeURI).length > 0 && keccak256(bytes(metadata)) == keccak256(bytes(streakBadgeURI));
        bool isMoodMaestroBadge = bytes(moodMaestroBadgeURI).length > 0 && keccak256(bytes(metadata)) == keccak256(bytes(moodMaestroBadgeURI));

        if (isFirstMintBadge || isStreakBadge || isMoodMaestroBadge) {
            require(from == address(0), "Badge is soulbound and cannot be transferred");
        }
        return super._update(to, tokenId, auth);
    }

    function getMintCount(address user) public view returns (uint256) {
        return userMintCount[user];
    }

    function getMoodTypes() external view returns (MoodType[] memory) {
        return moodTypes;
    }

    function getMoodMaestroMilestone() external view returns (uint256) {
        return moodMaestroMilestone;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        string memory metadata = moodMetadata[tokenId];

        if (_isIPFS(metadata)) {
            return metadata;
        }

        // --- UPDATED: This fallback logic is now mostly for local testing ---
        // --- since badges now mint directly with an IPFS URI. ---
        string memory streakBadgeName = string.concat(uint2str(streakMilestone), "-Day Streaker");
        string memory badgeJson;
        bool isBadge = false;

        // Note: These checks are now less critical since _update uses URIs, but kept for tokenURI generation if no IPFS URI is used.
        if (keccak256(bytes(metadata)) == keccak256(bytes("First Mint Badge"))) { isBadge = true; }
        if (keccak256(bytes(metadata)) == keccak256(bytes(streakBadgeName))) { isBadge = true; }
        if (keccak256(bytes(metadata)) == keccak256(bytes("MoodMaestroMilestone"))) { isBadge = true; }
        
        if (isBadge) {
            badgeJson = string.concat(
                '{"name":"',
                metadata,
                '","description":"Achievement badge for MintMyMood","image":"","attributes":[{"trait_type":"Badge","value":"',
                metadata,
                '"}]}'
            );
            return string.concat("data:application/json;base64,", base64Encode(bytes(badgeJson)));
        }

        return metadata;
    }

    function _isIPFS(string memory uri) internal pure returns (bool) {
        return bytes(uri).length > 7 && (keccak256(bytes(_substring(uri, 0, 7))) == keccak256(bytes("ipfs://")));
    }

    function _substring(string memory str, uint startIndex, uint endIndex) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }

    function base64Encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        string memory result = new string(4 * ((data.length + 2) / 3));
        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            for { let i := 0 } lt(i, mload(data)) { i := add(i, 3) } {
                let input := shl(248, mload(add(add(data, 32), i)))
                let out := mload(add(tablePtr, and(shr(250, input), 0x3F)))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(244, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(238, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(232, input), 0x3F))), 0xFF))
                out := shl(224, out)
                mstore(resultPtr, out)
                resultPtr := add(resultPtr, 4)
            }
            switch mod(mload(data), 3)
            case 1 { mstore(sub(resultPtr, 2), shl(240, 0x3d3d)) }
            case 2 { mstore(sub(resultPtr, 1), shl(248, 0x3d)) }
        }
        return result;
    }

    function getTokensOwnedBy(address owner) external view returns (uint256[] memory) {
        uint256 totalTokens = _tokenIdCounter;
        uint256 ownedCount = 0;
        for (uint256 i = 1; i <= totalTokens; i++) {
            if (_ownerOf(i) == owner) {
                ownedCount++;
            }
        }
        uint256[] memory ownedTokens = new uint256[](ownedCount);
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= totalTokens; i++) {
            if (_ownerOf(i) == owner) {
                ownedTokens[currentIndex] = i;
                currentIndex++;
            }
        }
        return ownedTokens;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        return string(bstr);
    }
}