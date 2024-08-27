// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./QuestingToken.sol";
import "./QuestingNFT.sol";

contract Questing is Ownable {
    QuestingToken public token;
    QuestingNFT public nft;

    struct Quest {
        uint256 questId;
        string question;
        address creator;
        uint256 createdAt;
    }

    struct Answer {
        uint256 answerId;
        string text;
        address respondent;
        uint256 voteCount;
        uint256 createdAt;
        bool rewarded;
    }

    uint256 public questCounter;
    uint256 public answerCounter;
    mapping(uint256 => Quest) public quests;
    mapping(uint256 => mapping(uint256 => Answer)) public answers;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public rewardAmount = 100 * 10 ** 18; // Reward 100 tokens

    event QuestCreated(uint256 indexed questId, string question, address indexed creator);
    event AnswerSubmitted(uint256 indexed questId, uint256 indexed answerId, string answer, address indexed respondent);
    event Voted(uint256 indexed questId, uint256 indexed answerId, address indexed voter);
    event RewardClaimed(uint256 indexed questId, uint256 indexed answerId, address indexed respondent);

    constructor(QuestingToken _token, QuestingNFT _nft) {
        token = _token;
        nft = _nft;
    }

    function createQuest(string memory question) public {
        questCounter++;
        quests[questCounter] = Quest({
            questId: questCounter,
            question: question,
            creator: msg.sender,
            createdAt: block.timestamp
        });

        emit QuestCreated(questCounter, question, msg.sender);
    }

    function submitAnswer(uint256 questId, string memory answer) public {
        require(quests[questId].creator != address(0), "Quest does not exist");

        answerCounter++;
        answers[questId][answerCounter] = Answer({
            answerId: answerCounter,
            text: answer,
            respondent: msg.sender,
            voteCount: 0,
            createdAt: block.timestamp,
            rewarded: false
        });

        emit AnswerSubmitted(questId, answerCounter, answer, msg.sender);
    }

    function vote(uint256 questId, uint256 answerId) public {
        require(quests[questId].creator != address(0), "Quest does not exist");
        require(answers[questId][answerId].respondent != address(0), "Answer does not exist");
        require(!hasVoted[questId][msg.sender], "You have already voted");

        answers[questId][answerId].voteCount++;
        hasVoted[questId][msg.sender] = true;

        emit Voted(questId, answerId, msg.sender);
    }

    function claimReward(uint256 questId, uint256 answerId) public {
        Answer storage answer = answers[questId][answerId];
        require(answer.respondent == msg.sender, "Only respondent can claim the reward");
        require(block.timestamp >= answer.createdAt + 3 days, "Answer must persist for 3 days");
        require(answer.voteCount > 0, "Answer must have votes");
        require(!answer.rewarded, "Reward already claimed");

        token.mint(msg.sender, rewardAmount);
        nft.mint(msg.sender);
        answer.rewarded = true;

        emit RewardClaimed(questId, answerId, msg.sender);
    }

    function setRewardAmount(uint256 amount) public onlyOwner {
        rewardAmount = amount;
    }
}
