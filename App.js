import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import QuestingABI from './abis/Questing.json';
import QuestingTokenABI from './abis/QuestingToken.json';
import QuestingNFTABI from './abis/QuestingNFT.json';
import './App.css';

const QUESTING_CONTRACT_ADDRESS = "0x1234567890abcdef1234567890abcdef12345678";
const TOKEN_CONTRACT_ADDRESS = "0xf8173a39c56a554837c4c7f104153a005d284d11";
const NFT_CONTRACT_ADDRESS = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [questingContract, setQuestingContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [answer, setAnswer] = useState('');
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  }, []);

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    
    setProvider(provider);
    setSigner(signer);
    setAccount(accounts[0]);

    // Connect to the contracts
    const questing = new ethers.Contract(QUESTING_CONTRACT_ADDRESS, QuestingABI, signer);
    const token = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, QuestingTokenABI, signer);
    const nft = new ethers.Contract(NFT_CONTRACT_ADDRESS, QuestingNFTABI, signer);

    setQuestingContract(questing);
    setTokenContract(token);
    setNftContract(nft);

    loadQuests(questing);
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(null);
    }
  };

  const loadQuests = async (questing) => {
    // Example: Fetching quests from the contract (this depends on how you store quests)
    setLoading(true);
    const questsCount = await questing.questCounter();
    const loadedQuests = [];

    for (let i = 1; i <= questsCount; i++) {
      const quest = await questing.quests(i);
      loadedQuests.push(quest);
    }

    setQuests(loadedQuests);
    setLoading(false);
  };

  const submitAnswer = async (questId) => {
    if (!answer) {
      alert('Please enter an answer');
      return;
    }

    const tx = await questingContract.submitAnswer(questId, answer);
    await tx.wait();

    alert(`Answer submitted: ${answer}`);
    setAnswer('');
    loadQuests(questingContract);
  };

  const voteOnAnswer = async (questId, answerId) => {
    const tx = await questingContract.vote(questId, answerId);
    await tx.wait();

    alert('Vote submitted!');
    loadQuests(questingContract);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Questing DApp</h1>
        {!account ? (
          <button onClick={connectWallet} className="btn-connect">
            Connect Wallet
          </button>
        ) : (
          <p>Connected: {account}</p>
        )}

        <div className="quests-section">
          <h2>Quests</h2>
          {loading ? (
            <p>Loading quests...</p>
          ) : (
            quests.map((quest, index) => (
              <div key={index} className="quest">
                <p>Question: {quest.question}</p>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer"
                />
                <button onClick={() => submitAnswer(quest.questId)} className="btn-submit">
                  Submit Answer
                </button>
                {/* Add a section for voting on answers */}
              </div>
            ))
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
