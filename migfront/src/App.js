import logo from './logo.svg';
import './App.css';
import React, { useEffect,useState } from 'react';
import Web3 from 'web3';
import MyContract from './build/MigrationToken.json';
import UPage from './UserPage.js';
import GPage from './GovernmentPage.js';



const web3 = new Web3(window.ethereum);
const contractABI = MyContract.abi;
const networkId = await web3.eth.net.getId();
const contractAddress = MyContract.networks[networkId].address;
const instance = new web3.eth.Contract(contractABI, contractAddress);

function App() {
  const [Account, setAccount] = useState('');
  const [Group, setGroup] = useState('');
  const [Owner, setOwner] = useState('')



  //アカウントの所属判定
  useEffect(() => {
    const GetA = () => {
      web3.eth.getAccounts().then((resolve) => {
        setAccount(resolve[0]);
        instance.methods.checkAccount(resolve[0]).call().then((resolve) => {
          setGroup(resolve[0]);
        }).catch((err) => {});
      });
    }
    GetA();
  });

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
        setAccount(accounts[0]);
        instance.methods.checkAccount(accounts[0]).call().then((resolve) => {
          setGroup(resolve);
        }).catch(() => {
          return ;
      });
    };
  // アカウントの変更を購読
  window.ethereum.on('accountsChanged', handleAccountsChanged);
  return () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }}
  }, []);
  
  return (
    <div>
      {Account ? (
      Group? (<UPage account={Account} />):(<GPage account={Account} />))
      :(<p>Connect with MetaMask to view the account page.</p>)}
    </div>
  );
}

export default App;
