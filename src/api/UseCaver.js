import Caver from 'caver-js';
import CounterABI from '../abi/CounterABI.json';
import  { ACCESS_KEY_ID, SECRET_KEY, COUNT_CONTRACT_ADDRESS, CHAIN_ID  } from '../constants/index'

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
 
export const readCount = async () => {
const count = CountContract.methods.count().call();
    console.log(count);
    }

export const getBalance = (address) => {
            return caver.rpc.klay.getBalance(address).then((response) => {
                const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
                console.log(`BALANCE : ${balance}`);
                return balance;
        })
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
