import logo from './logo.svg';
import './App.css';
import { getBalance, readCount, setCount } from './api/UseCaver';
import React, { useState }  from "react";
import QRCode from "qrcode.react";
import * as KlipApi from './api/UseKlip'

// import Caver from 'caver-js';

// 1 SmartContract 배포 주소 파악(가져오기)
// 2  caver.js 이용해서 스마트 컨트랙트 연동하기
// 3 가져온 스마트컨트랙트 실행결과(데이터) 웹에 표현하기 

// const COUNT_CONTRACT_ADDRESS = '0x12047AFCF81299bd95d3EEc94f493D11a9f8cDfB';
// const ACCESS_KEY_ID = 'KASKNMMHD2BQMO9L6XR3CV5L';
// const SECRET_KEY = 'o3Z9vB3usRMpwP7AunDUc9G-fLa3PzVMg8mzqL1f';
// const CHAIN_ID = '1001'; //Baobab MAINNET 8217   TESTNET1001
// const COUNT_ABI = '[ { "constant": false, "inputs": [ { "name": "_count", "type": "uint256" } ], "name": "setCount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "count", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getBlockNumber", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]';

// const option = {
//   headers: [
//     {
//     name: "Authorization",
//     value: "Basic " + Buffer.from(ACCESS_KEY_ID +":" +SECRET_KEY).toString("base64")
//     },
//     {name: "x-chain-id", value: CHAIN_ID}
//   ]
// }

// const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));
// const CountContract = new caver.contract(JSON.parse(COUNT_ABI), COUNT_CONTRACT_ADDRESS);

// const readCount = async () => {
//   const count = CountContract.methods.count().call();
//   console.log(count);
// }


// const getBalance = (address) => {
//   return caver.rpc.klay.getBalance(address).then((response) => {
//     const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
//     console.log(`BALANCE : ${balance}`);
//     return balance;
//   })
// }

// const setCount = async (newCount) => {
//   try{
//     // 사용할 account 설정
//     const privatekey = '0xda8681f9d9e8c656928f3302cfe1962aa55d9e4dd457d40bcab6ece036b61268';
//     const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
//     caver.wallet.add(deployer);
//     // 스마트 컨트랙트 실행 트랜젝션 날리기
//     // 결과 확인

//     const receipt = await CountContract.methods.setCount(newCount).send({
//       from: deployer.address, //COUNT_CONTRACT_ADDRESS
//       gas: "0x4bfd200"
//     });
//     console.log(receipt);

//   } catch (e){
//     console.log(`[ERROR_SET_COUNT] ${e}`);
//   }
  
// }

function onPressTestButton() {
  console.log('hi');
}

const DEFAULT_OR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = "0x00000000000000000000000000000000";
function App() {
  //Ch5. 
  //GlobalData
  // balance, address, nft
  //UI 
  // qr, tab, mintInput
  //Modal
  
  // fetchMarketNFTs, fetchMyNFTs, onClickMint, onClickMyCard(sell), onClickMarketCard(buy), getUserData

  // readCount();
  // getBalance('0x933E36c8564Cb779e1e858c433D98AfA2EDEA2cc');


  const [nfts, setNfts] = useState([]);
  const [myBalance, setMyBalance] = useState('0');
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  const [qrvalue, setQrvalue] = useState(DEFAULT_OR_CODE);

  

  const onClickGetAddress = () => {
    KlipApi.getAddress(setQrvalue);
  }
 
  const onClickSetCount = () => {
    KlipApi.setCount(2000, setQrvalue);
  }


  return (
    <div className="App">
      {/* 주소 잔고 */}
      {/* 갤러리 (Market, 내 지갑) */}
      {/* 발행 */}
      {/* 탭 */}
      {/* Modal */}

      {/* <header className="App-header">

        <img src={logo} className="App-logo" alt="logo" />
        <button title={'카운트변경'} onClick={() => setCount(100)}/>
        <button onClick={() => {
          //onPressTestButton2('15', setBalance)
          onClickGetAddress();
          }}>주소 가져오기</button>

          <button onClick={() => {
          //onPressTestButton2('15', setBalance)
          onClickSetCount();
          }}>카운트 값 변경</button>

        <br />
        <br />
        <br />

        <QRCode value={qrvalue} /> 
        {/*  app-app 연결 deep link, app-browser 연결 QRcode 

        <p>
          Edit <code>src/App.js</code> and save to reload.
          { balance }
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

    </div>
  );
}

export default App;
