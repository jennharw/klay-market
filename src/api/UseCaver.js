import Caver from 'caver-js';
import CounterABI from '../abi/CounterABI.json';
import KIP17ABI from '../abi/KIP17TokenABI.json';

import  { ACCESS_KEY_ID, SECRET_KEY, COUNT_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS, MARKET_CONTRACT_ADDRESS ,CHAIN_ID  } from '../constants/index'

const option = {
    headers: [
      {
      name: "Authorization",
      value: "Basic " + Buffer.from(ACCESS_KEY_ID +":" +SECRET_KEY).toString("base64")
      },
      {name: "x-chain-id", value: CHAIN_ID}
    ]
  }
  
const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));
const CountContract = new caver.contract(CounterABI, COUNT_CONTRACT_ADDRESS);
const NFTContract = new caver.contract(KIP17ABI, NFT_CONTRACT_ADDRESS);


export const fetchCardsOf = async (address) => {
    //Fetch balance
    const balance = await NFTContract.methods.balanceOf(address).call();
    console.log(`[NFT balance] ${balance}`);
    //Fetch TokenIds
    const tokenIds = [];
    for (let i = 0 ; i <balance ; i++){
        const id = await NFTContract.methods.tokenOfOwnerByIndex(address, i).call();
        tokenIds.push(id);
    }
    //Fetch TokenUris
    const tokenUris = [];
    for (let i = 0 ; i <balance ; i++){
        const uri = await NFTContract.methods.tokenURI(tokenIds[i]).call();
        tokenUris.push(uri);
    }

    console.log(`[tokenIds] ${tokenIds}`);
    console.log(`[tokenUris] ${tokenUris}`);
    console.log(`[tokenUris] ${tokenUris[0]}`);
    console.log(`[tokenUris] ${tokenUris[1]}`);

    const nfts = [];
    for (let i = 0; i < balance; i++){
        nfts.push({ uri: tokenUris[i], id: tokenIds[i] });

    }
    console.log(nfts);
    return nfts;

}


export const getBalance = (address) => {
            return caver.rpc.klay.getBalance(address).then((response) => {
                const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
                console.log(`BALANCE : ${balance}`);
                return balance;
        })
    }

    

export const readCount = async () => {
    const count = await CountContract.methods.count().call();
        console.log(count);
        }
export const setCount = async (newCount) => {
    try{
        // 사용할 account 설정
        const privatekey = '0xda8681f9d9e8c656928f3302cfe1962aa55d9e4dd457d40bcab6ece036b61268';
        const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
        caver.wallet.add(deployer);
        // 스마트 컨트랙트 실행 트랜젝션 날리기
        // 결과 확인

        const receipt = await CountContract.methods.setCount(newCount).send({
        from: deployer.address, //COUNT_CONTRACT_ADDRESS
        gas: "0x4bfd200"
        });
        console.log(receipt);

    } catch (e){
        console.log(`[ERROR_SET_COUNT] ${e}`);
    }

}
