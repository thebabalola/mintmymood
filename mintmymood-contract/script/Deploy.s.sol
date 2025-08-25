// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/console.sol";
import {Script} from "forge-std/Script.sol";
import {MintMyMood} from "../src/MintMyMood.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address admin = vm.addr(deployerPrivateKey);

        // Initialize 20 moods
        MintMyMood.MoodType[] memory initialMoodTypes = new MintMyMood.MoodType[](20);
        initialMoodTypes[0] = MintMyMood.MoodType("Happy", "Positive");
        initialMoodTypes[1] = MintMyMood.MoodType("Grateful", "Positive");
        initialMoodTypes[2] = MintMyMood.MoodType("Hopeful", "Positive");
        initialMoodTypes[3] = MintMyMood.MoodType("Excited", "Positive");
        initialMoodTypes[4] = MintMyMood.MoodType("Sad", "Negative");
        initialMoodTypes[5] = MintMyMood.MoodType("Anxious", "Negative");
        initialMoodTypes[6] = MintMyMood.MoodType("Frustrated", "Negative");
        initialMoodTypes[7] = MintMyMood.MoodType("Lonely", "Negative");
        initialMoodTypes[8] = MintMyMood.MoodType("Meh", "Neutral");
        initialMoodTypes[9] = MintMyMood.MoodType("Bored", "Neutral");
        initialMoodTypes[10] = MintMyMood.MoodType("Tired", "Neutral");
        initialMoodTypes[11] = MintMyMood.MoodType("Chill", "Neutral");
        initialMoodTypes[12] = MintMyMood.MoodType("Passionate", "HighIntensity");
        initialMoodTypes[13] = MintMyMood.MoodType("Hyped", "HighIntensity");
        initialMoodTypes[14] = MintMyMood.MoodType("Determined", "HighIntensity");
        initialMoodTypes[15] = MintMyMood.MoodType("Dreamy", "Aesthetic");
        initialMoodTypes[16] = MintMyMood.MoodType("Zen", "Aesthetic");
        initialMoodTypes[17] = MintMyMood.MoodType("Delulu", "Niche");
        initialMoodTypes[18] = MintMyMood.MoodType("Main character energy", "Niche");
        initialMoodTypes[19] = MintMyMood.MoodType("Motivated", "Productivity");

        uint256 streakMilestone = 3;
        uint256 moodMaestroMilestone = 25;

        vm.startBroadcast(deployerPrivateKey);
        MintMyMood mintMyMood = new MintMyMood(admin, initialMoodTypes, streakMilestone, moodMaestroMilestone);
        vm.stopBroadcast();

        // Log contract address
        console.log("MintMyMood deployed at:", address(mintMyMood));
    }
}