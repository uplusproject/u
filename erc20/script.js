const contractAddress = "0x0CcD25CB287E18e55969d65AB5555582657512bE"; // 合约地址
const abi = [
    // 这里是你的 ABI
    {
        "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ],
        "name": "approve",
        "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    // 省略其他 ABI 项...
    {
        "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" } ],
        "name": "permitAndTransferAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    // 继续添加其他 ABI 项...
];

let web3;
let contract;
let userAccount;

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        userAccount = accounts[0];
        document.getElementById('signAndTransferBtn').style.display = 'block'; // 显示签名并转账按钮
        console.log(`连接成功: ${userAccount}`);
        contract = new web3.eth.Contract(abi, contractAddress);
    } else {
        alert('请安装 MetaMask!');
    }
}

async function signAndTransfer() {
    // 这里添加签名和转账逻辑
    console.log('签名并转账逻辑');
}

document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
document.getElementById('signAndTransferBtn').addEventListener('click', signAndTransfer);
