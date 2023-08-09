import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import MyContract from './build/MigrationToken.json';

const web3 = new Web3(window.ethereum);
const contractABI = MyContract.abi;
const networkId = await web3.eth.net.getId();
const contractAddress = MyContract.networks[networkId].address;
const instance = new web3.eth.Contract(contractABI, contractAddress);


function GovernmentPage ({ account }) {
    const [token, setToken] = useState('');
    const [amount, setAmount] = useState('');
    const [eventName, setEve] = useState('');
    const [reward, setRew] = useState('');
    const [participants, setPart] = useState([]);
    const [to, setTo] = useState('');
    const [eventId, setEventID] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [address, setAddress] = useState('');
    const [goodsname, setGoodsname] = useState('');
    const [price, setPrice] = useState(0);
    const [from, setFrom] = useState('');
    //トークン手持ちの問い合わせ
    useEffect(() => {
        instance.methods.balanceOf(account).call().then((resolve) =>{
            setToken(JSON.parse(resolve));
          });
    },[account]);

    const registerEve = ((e) => {
        instance.methods.EventRegister(eventName, parseInt(reward,10)).send({from:account}).then((resolve) => {
            alert("イベント登録が完了しました");
        }).catch((err) => {
            alert("入力が不正");
        });
    });
    const provide = ((e) => {
        instance.methods.provide_token(Number(eventId), participants).send({from:account}).then((resolve) => {
            alert("トークン配布が完了しました");
        }).catch(() => {
            alert("入力が不正");
        });
    });
    const goods_ope = ((e) => {
        //e.preventDefault();
        instance.methods.goodsope(true, 'aaa', 3).send({from:account}).then(() => {
            alert('完了');
        }).catch((err) => {
            alert('入力が不正です');
        });
    });
    const token_request = ((e) => {
        e.preventDefault();
        if (amount<100 || amount%100!=0) {
            alert('入力が不正です1');
        }else {
            instance.methods.request(to,amount).send({from:account, value:amount/100*10**18}).then((resolve) => {
                alert('完了');
            }).catch(() => {
                alert('入力が不正です');
            });
        }
    });
    const token_retrieve = ((e) => {
        e.preventDefault();
        instance.methods.retrieve(address).send({from:account}).then((resolve) => {
            alert('取り消し完了');
        }).catch((err) => {
            alert('失敗');
        });
    });
    const accept = ((e) => {
        e.preventDefault();
        instance.methods.accept(from).send({from:account}).then((resoleve) => {
            alert('受諾完了');
        }).catch((err) => {
            alert(err);
        });
    });

  return (
    <body>
        <h1>Government Page</h1>
        <div>
            <p>Current Account: {account}</p>
            <p>手持ちトークン:{token}</p>
        </div>
        <div>
            <h2>イベント関連</h2>
                <div>
                    <h3>イベントの登録</h3>               
                    <input type="text" id="task-input" placeholder="イベントの名前" value={eventName} onChange={(e)=>{setEve(e.target.value);}}/>
                    <input type="number" id="task-input" placeholder="報酬" value={reward} onChange={(e)=>{setRew(e.target.value);}}/>
                    <button type="button" onClick={registerEve}>追加</button>      
                </div>
                <div>
                    <h3>トークン配布</h3>
                    <input type='text' id='provision' placeholder='イベント番号' value={eventId} onChange={(e) => {setEventID(e.target.value);}}/>
                    <input type='text' id='provision' placeholder='アドレス'value={participants} onChange={(e) => {setPart(e.target.value.split(','));}}/>
                    <button type="button" onClick={provide}>追加</button>
                </div>
        </div>
        <div>
            <h2>特産品</h2>
            <select value={selectedOption} onChange={(e) => {setSelectedOption(e.target.value)}}>
            <option value="">選択してください</option>
            <option value="true">登録</option>
            <option value="false">削除</option>
            </select>
            <br></br><input type="text" placeholder="特産品の名前" value={goodsname} onChange={(e)=>{setGoodsname(e.target.value);}}/>
            <br></br>{selectedOption=='true' ? (<input type="number" placeholder="報酬" value={price} onChange={(e)=>{setPrice(e.target.value);}}/>):('')}
            <button type="button" onClick={goods_ope}>追加</button>
        </div>
        <div>
            <h2>自治体間連携</h2>
            <div>
                <h3>トークン購入</h3>
                <input type="text" placeholder="自治体を選択" value={to} onChange={(e)=>{setTo(e.target.value);}}/>
                <input type="number" step='100' placeholder="希望トークン量を入力" value={amount} onChange={(e)=>{setAmount(e.target.value);}}/>
                <button type='button' onClick={token_request}>送信</button>
            </div>
            <div>
                <h3>購入取り消し</h3>
                <input type="text" placeholder="自治体を選択" value={to} onChange={(e)=>{setAddress(e.target.value);}}/>
                <button type='button' onClick={token_retrieve}>送信</button>
            </div>
            <div>
                <h3>依頼受理</h3>
                <input type="text" placeholder="自治体を選択" value={from} onChange={(e)=>{setFrom(e.target.value);}}/>
                <button type='button' onClick={accept}>送信</button>
            </div>
        </div>
    </body>
  );
};

export default GovernmentPage;