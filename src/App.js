import logo from './logo.svg';
import { getBalance, readCount, setCount, fetchCardsOf } from './api/UseCaver';
import React, { useState, useEffect }  from "react";
import QRCode from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faWallet, faPlus } from "@fortawesome/free-solid-svg-icons";
import * as KlipApi from './api/UseKlip';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import './market.css';
import {Alert, Container, Card, Nav, Form, Button, Modal, Row, Col} from "react-bootstrap";
import  { MARKET_CONTRACT_ADDRESS } from './constants'

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
  // const onPressTestButton2 = (_balance, _setBalance) => { // 변수 뿐 아니라 함수도 넘길 수 있다
  //   _setBalance(_balance);
  //   //setBalance('10')
  // }
  // const onClickGetAddress = () => {
  //   KlipApi.getAddress(setQrvalue);
  // } 
  // const onClickSetCount = () => {
  //   KlipApi.setCount(2000, setQrvalue);
  // }


  const [nfts, setNfts] = useState([]); //[{tokenId:100, tokenUri: "https://sdf.png"}, {tokenId:101, tokenUri: "https://sdsf.png"},]
  const [myBalance, setMyBalance] = useState('0');
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  const [qrvalue, setQrvalue] = useState(DEFAULT_OR_CODE);
  const [tab, setTab] = useState('MARKET'); //MINT, WALLET
  const [mintImageUrl, setMintImageUrl] = useState("");

 //Modal
 const [showModal, setShowModal] = useState(false);
 const [modalProps, setModalProps] = useState({
   title: "MODAL",
   onConfirm: () => {},
 })

 const rows = nfts.slice(nfts.length / 2); 



  const getUserData = () => {
    setModalProps({
      title:"Klip 지갑을 연동하시겠습니까?",
      onConfirm: () =>{
                //자신의 주소  callback
          KlipApi.getAddress(setQrvalue, async (address) => {
            setMyAddress(address);

            const _balance = await getBalance(address);
            setMyBalance(_balance);
          });
          //자신의 잔고
      },
    });
    setShowModal(true);
  };

  const fetchMyNFTs = async () => {
    if (myAddress === DEFAULT_ADDRESS){ alert("NO Address") ;
    return;}

    //contract 가져오기  - caver js
    //[{tokenId:100, tokenUri: "https://sdf.png"}, {tokenId:101, tokenUri: "https://sdsf.png"},]
    const _nfts = await fetchCardsOf(myAddress); // "0xb61bCe3f038f4B32BD2fb086bE9c96aFB4c83474"
    setNfts(_nfts);
    //balanceOf -> 내가 가진 전체  NFT 토큰 갯수를 가져오기
    //2
    // tokenOfOwnerByIndex ->   내가 가진 NFT token ID를 하나씩 가져온다  -  배열로
    // 0xb61bCe3f038f4B32BD2fb086bE9c96aFB4c83474 , 0 => 100
    // 0xb61bCe3f038f4B32BD2fb086bE9c96aFB4c83474 , 1 => 101
    // tokenURI -> 앞에서 가져온 tokenID를 이용해서 tokenURI 를 하나씩 가져온다 
    // 100 -> sdf.png
    // 101 ->  sdsf.png
  }




  const fetchMarketNFTs = async () => {
    
    const _nfts = await fetchCardsOf(MARKET_CONTRACT_ADDRESS); // "0xb61bCe3f038f4B32BD2fb086bE9c96aFB4c83474"
    setNfts(_nfts);

  }

  const onClickMint = async (uri) => {
    if (myAddress === DEFAULT_ADDRESS){ alert("NO Address") ;
    return;}
    const randomTokenId = parseInt(Math.random() * 100000000000);
    KlipApi.mintCardWithURI(myAddress, randomTokenId, uri, setQrvalue, (result) => {
      alert(JSON.stringify(result));
    })

  }

  const onClickCard = (tokenId) => {



    if (tab === 'WALLET') {
      setModalProps ({
        title:"NFT를 Market에 올리시겠습니까?", 
        onConfirm: () => {
          onClickMyCard(tokenId);
        },
      });
      setShowModal(true);     
      console.log("WALLET");
    }
    if (tab === 'MARKET') {
      setModalProps ({
        title:"NFT를 구매하시겠습니까?", 
        onConfirm: () => {
          onClickMarketCard(tokenId);
        },
      });
      setShowModal(true);     
     
    }
    
  }

  const onClickMyCard = (tokenId) => {
      KlipApi.listingCard(myAddress, tokenId, setQrvalue, (result) => {
        alert(JSON.stringify(result));
      });
  }

  const onClickMarketCard = (tokenId) => {
    KlipApi.buyCard(tokenId, setQrvalue, (result) => {
      alert(JSON.stringify(result));
    });

  }


  useEffect( () => {
    getUserData() ;
    fetchMarketNFTs();
  }, []
     
  )

  return (
    <div className="App">
      {/* 주소 잔고 */}
      {/* 갤러리 (Market, 내 지갑) */}
      {/* 발행 */}
      {/* 탭 */}
      {/* Modal */}
      <div style={{backgroundColor: "black", padding: 10}}>
        <div style={{fontSize:30, fontWeight: "bold", paddingLeft:5, marginTop:10}}>내 지갑</div>
        {myAddress}
        <br />
        <Alert 
          onClick={getUserData}  
          variant= {"balance"}
          style={{backgroundColor: "#f40075", fontSize: 25}}
        > 

          {myAddress !== DEFAULT_ADDRESS ? `${myBalance} Klay` : "지갑 연동하기"}
          {/* {myBalance}  */}
        </Alert>
      {/* 갤러리 (Market, 내 지갑) */}
      {qrvalue !== "DEFAULT" ? (     
      <Container style={{backgroundColor:"white", width:300, height:300, padding:20,}}>
          
          <QRCode value={qrvalue} size={256} style={{ margin : "auto" }}/>
          <br />
          <br />
          <br />

      </Container> ) : null}


      {tab === "MARKET" || tab === "WALLET" ? (
        <div className="container" style={{ padding:0, width: "100%" }}>
          {rows.map((o, rowIndex) => {
            console.log("row")
            console.log(rowIndex);
            console.log(nfts[rowIndex*2].id);
            
            <Row key={`rowKey${rowIndex}`}>

              <Col style={{marginRight:0, paddingRight: 0}}>
              <Card onClick={() =>{
                  onClickCard(nfts[rowIndex*2].id);
                }}>
                  <Card.Img src={nfts[rowIndex*2].uri} />
              </Card>
              </Col>
              [{nfts[rowIndex*2].id}] NFT
              
              {/* <Col style={{marginRight:0, paddingRight: 0}}>
                {
                  nfts.length > rowIndex * 2 + 1 ? (
                 
                                <Card onClick={() =>{
                                    onClickCard(nfts[rowIndex*2+1].id);
                                  }}>
                                    <Card.Img src={nfts[rowIndex*2 + 1].uri} />
                                </Card>
                               // 
                               
                  ) :null
                }
                {
                  nfts.length > rowIndex * 2 + 1 ? (
                    <>[{nfts[rowIndex*2 + 1].id}] NFT</>  
                  ) : null }
                </Col>     */}    
            </Row>
          })} 
           
          {nfts.map((nft,index) => (
            
            <Card.Img key={`imgkey${index}`} 
            onClick={() =>{
              console.log(nfts.length/2);
              console.log(nfts.slice(nfts.length / 2));
              console.log()
              console.log(rows);
              console.log(nft.id);
            //  onClickCard(nft.id);
            }}
            className="img-responsive" src={nfts[index].uri} />
          ))}
        </div>
        ): null }


      {/* 발행페이지 */}
      {tab === "MINT" ? (
        <div className='container' style={{padding:0, width:"100%"}}>
          MINT
          <Card className="text-center" style={{ color:"black", height:"50%", borderColor: "#C5B358" }}>
            <Card.Body style={{ opacity: 0.9, backgroundColor: "black"}} >
              {mintImageUrl !== "" ? (<Card.Img src={mintImageUrl} height={"50%"} />) : null}
              <Form>
                <Form.Group>
                  <Form.Control value={mintImageUrl} onChange={(e) => {
                    console.log(e.target.value);
                    setMintImageUrl(e.target.value);
                  }}
                  type="text"
                  placeholder="Image 주소를 입력하세요"/>
                </Form.Group>
                <br />
                <Button
                onClick={() => {
                  onClickMint(mintImageUrl);
                }}
                variant="primary" style={{ backgroundColor:"#810034", borderColor: "#810034" }}>
                  발행하기
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>  
      ) : null }

      </div>

      <br /><br /><br /><br /><br /><br />

      
      {/* <button onClick={fetchMyNFTs}>
        NFT 가져오기
      </button> */}

      {/* Modal */}
      <Modal 
      centered
      size="sm"
      show={showModal}
      onHide={() => {
        setShowModal(false);
      }}
      >
        <Modal.Header closeButton style={{border: 0, backgroundColor:"black", opacity:0.8}}>
          <Modal.Title>{modalProps.title}</Modal.Title>
        </Modal.Header>
        <Modal.Footer style={{border: 0 , backgroundColor:"black", opacity:0.8}}>

          <Button variant="secondary" onClick={() => {setShowModal(false)}}>닫기</Button>
          <Button variant="primary" onClick={() => {
            modalProps.onConfirm();
            setShowModal(false);
            }}
            style={{ backgroundColor: "#810034", borderColor:"#810034" }}>진행</Button>
        </Modal.Footer>
      </Modal>


        {/* 탭  */}
      <nav style={{backgroundColor : "#1b1717", height : 45}} className="navbar fixed-bottom navbar-light" roles="navigation">
          <Nav className="w-100">
            <div className="d-flex flex-row justify-content-around w-100">
              <div onClick={() => {
                setTab("MARKET");
                fetchMarketNFTs();

              }}
              className='row d-flex flex-column justify-content-center align-items-center'>
                {/* <div>MARKET</div> */}
                <div><FontAwesomeIcon color="white" size="lg" icon={faHome} /></div>
              </div>

              <div onClick={() => {
                setTab("MINT");
                
              }}
              className='row d-flex flex-column justify-content-center align-items-center'>
                {/* <div>MINT</div> */}
                <div><FontAwesomeIcon color="white" size="lg" icon={faPlus} /></div>

              </div>

              <div onClick={() => {
                setTab("WALLET");
                fetchMyNFTs();
                
              }}
              className='row d-flex flex-column justify-content-center align-items-center'>
                {/* <div>WALLET</div> */}
                <div><FontAwesomeIcon color="white" size="lg" icon={faWallet} /></div>

              </div>

            </div>
          </Nav>
      </nav>


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
