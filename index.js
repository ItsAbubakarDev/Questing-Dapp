import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
    } else {
      setAccount(null);
      setIsConnected(false);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (err) {
        console.error("User rejected connection request.");
      }
    } else {
      alert('Please install MetaMask to use this app.');
    }
  };

  const submitAnswer = async () => {
    if (!answer) {
      alert('Please enter an answer');
      return;
    }


    alert(`Answer submitted: ${answer}`);
    setAnswer('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Questing DApp</h1>
        {!isConnected ? (
          <button onClick={connectWallet} className="btn-connect">
            Connect Wallet
          </button>
        ) : (
          <p>Connected: {account}</p>
        )}

        <div className="quest-section">
          <h2>Submit Your Answer</h2>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
          />
          <button onClick={submitAnswer} className="btn-submit">
            Submit Answer
          </button>
        </div>

        <div className="vote-section">
          <h2>Vote on Answers</h2>
          {/* Here you'd display answers and voting buttons */}
        </div>

        <div className="rewards-section">
          <h2>Your Rewards</h2>
          {/* Display tokens/NFTs user has earned */}
        </div>
      </header>
    </div>
  );
}

export default App;
