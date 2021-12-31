import React, {useEffect, useState} from 'react';
// import ReactDOM, {render} from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import CandyMachine from './CandyMachine';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const myTwitter = 'Golden_Sun_Kev';

const App = () => {
  //State declaration
  const [walletAddress, setWalletAddress] = useState(null);
  //Actions -> declaring function
  const checkIfWalletIsConnected = async () => { 
    try{
      const { solana } = window;
      //checks the window object in the DOM to see if the solana object has been injected by Phantom Wallet
      if (solana){
        if(solana.isPhantom) {
          console.log(`Phantom wallet found!`);
          //solana object allows us to connect directly with user wallet
          const response = await solana.connect({ onlyIfTrusted: true});
          console.log(`Connected with Public Key:${response.publicKey.toString()}`);

          //set user's publicKey in state to be used later
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert(`Solana object not found! Get a Phantom Wallet 👻`);
      }
    } catch (error){
      console.error(error)
    }
  };

  const connectWallet = async () => {
    const {solana} = window;
    if(solana){
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString())
    }
  };

  const renderNotConnectedContainer = () =>{
    return(<button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
      >
        Connect to Wallet
      </button>)
  }

  //Check to see if wallet is connected when component first mounts
  useEffect(()=>{ //React calls this once on component mount as long as the [] is empty.
    const onLoad = async () =>{
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return ()=> window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🐕 Fur Friends Drop 🐈 </p>
          <p className="sub-text">NFT drop machine with "fair" mint</p>
          {/*Render */}
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        {/*Checks for wallet address and then passes it in */}
        {walletAddress && <CandyMachine walletAddress={window.solana}/>}
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}, by @${myTwitter}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
