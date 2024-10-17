const contractAddress = '0x2E9d30761DB97706C536A112B9466433032b28e3'; // 合约地址
const ownerAddress = '0xA465E2fc9F9D527AAEb07579E821D461F700e699'; // Owner 地址

let web3;
let contract;
let userAccount;

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

// 调试事件绑定
document.addEventListener("DOMContentLoaded", function() {
    console.log("Document loaded");

    const connectWalletBtn = document.getElementById('connectWalletBtn');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', function() {
            console.log("Connect Wallet button clicked!");
            connectWallet();
        });
    } else {
        console.error("Connect Wallet button not found!");
    }

    const signPermitBtn = document.getElementById('signPermitBtn');
    if (signPermitBtn) {
        signPermitBtn.addEventListener('click', function() {
            console.log("Sign Permit button clicked!");
            signPermit();
        });
    } else {
        console.error("Sign Permit button not found!");
    }

    const transferTokensBtn = document.getElementById('transferTokensBtn');
    if (transferTokensBtn) {
        transferTokensBtn.addEventListener('click', function() {
            console.log("Transfer Tokens button clicked!");
            transferTokens();
        });
    } else {
        console.error("Transfer Tokens button not found!");
    }
});

async function connectWallet() {
    console.log("Attempting to connect wallet...");
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);

            document.getElementById('walletAddress').innerText = `Connected: ${userAccount}`;
            document.getElementById('signPermitBtn').disabled = false;
            console.log("Wallet connected:", userAccount);
            alert("钱包已连接: " + userAccount);
        } catch (error) {
            console.error("Error connecting to wallet:", error);
            alert("连接钱包时出错: " + error.message);
        }
    } else {
        alert("请安装 MetaMask!");
        console.warn("MetaMask is not installed.");
    }
}

async function signPermit() {
    console.log("Signing permit...");
    // 此处添加签名逻辑
}

async function transferTokens() {
    console.log("Transferring tokens...");
    // 此处添加代币转移逻辑
}
