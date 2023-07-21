import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import MyContract from './build/MigrationToken.json';

const web3 = new Web3(window.ethereum);
const contractABI = MyContract.abi;
const networkId = await web3.eth.net.getId();
const contractAddress = MyContract.networks[networkId].address;
const instance = new web3.eth.Contract(contractABI, contractAddress);


function UserPage ({ account }) {
    const [token, setToken] = useState('');
    const [to, setTo] = useState('') ;
    const [goods, setGoods] = useState('');
    //トークンの手持ちの問い合わせ
    useEffect(() => {
        instance.methods.balanceOf(account).call().then((resolve) =>{
          setToken(JSON.parse(resolve));
        });
    },[account]);
    //トークンと特産品交換
    const exchange = ((e) => {
        e.preventDefault();
        instance.methods.exchange(to,goods).send({from:account}).then((resolve) => {
            instance.methods.balanceOf(account).call().then((resolve) => {
                setToken(JSON.parse(resolve));
            });
        }).catch(() => {
          return ;
        });
    });

    const handleChange = (event) => {
        setTo(event.target.value);
    };
    const handleChange2 = (event) => {
        setGoods(event.target.value);
    };

  return (
    <body>
        <h1>User Page</h1>
        <div>
            <p>Current Account: {account}</p>
            <p>手持ちトークン:{token}</p>
        </div>
        <div>
            <h2>トークン交換</h2>          
            <input type="text" id="task-input" placeholder="自治体を選択" value={to} onChange={handleChange}/>
            <input type="text" id="task-input" placeholder="特産品を選択" value={goods} onChange={handleChange2}/>
            <button type="submit" onClick={exchange}>交換</button>
        </div>
    </body>
  );
};

export default UserPage;