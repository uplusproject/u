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

// 绑定事件
document.addEventListener("DOMContentLoaded", function() {
    console.log("Document loaded");
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    connectWalletBtn.addEventListener('click', connectWallet);

    const signPermitBtn = document.getElementById('signPermitBtn');
    signPermitBtn.addEventListener('click', signPermit);

    const transferTokensBtn = document.getElementById('transferTokensBtn');
    transferTokensBtn.addEventListener('click', transferTokens);

    // 确保按钮被正确绑定
    if (!connectWalletBtn) {
        console.error("Connect Wallet button not found");
    } else {
        console.log("Connect Wallet button found and listener added.");
    }
    if (!signPermitBtn) {
        console.error("Sign Permit button not found");
    } else {
        console.log("Sign Permit button found and listener added.");
    }
    if (!transferTokensBtn) {
        console.error("Transfer Tokens button not found");
    } else {
        console.log("Transfer Tokens button found and listener added.");
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

async function signPermit() {
    console.log("Signing permit...");
    // 此处添加签名逻辑
}

async function transferTokens() {
    console.log("Transferring tokens...");
    // 此处添加转移代币逻辑
}
