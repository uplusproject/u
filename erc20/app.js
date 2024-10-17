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
    console.log("Document loaded");
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
    document.getElementById('signPermitBtn').addEventListener('click', signPermit);
    document.getElementById('transferTokensBtn').addEventListener('click', transferTokens);
});

async function connectWallet() {
    console.log("Connecting to wallet...");
    if (window.ethereum) {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);
            const accounts = await web3.eth.getAccounts();
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

async function signPermit() {
    console.log("Signing permit...");
    // 在此处实现签名逻辑
    // 例如，调用合约的 permit 方法并处理相应的结果
    try {
        // 示例代码，具体实现根据你的需求修改
        const deadline = Math.floor(Date.now() / 1000) + 60 * 60; // 1小时后的截止时间
        const value = web3.utils.toWei('1', 'ether'); // 转移的代币数量
        const v = 0; // 示例，实际值需要从签名结果中获取
        const r = '0x...'; // 示例，实际值需要从签名结果中获取
        const s = '0x...'; // 示例，实际值需要从签名结果中获取

        await contract.methods.permit(ownerAddress, userAccount, value, deadline, v, r, s).send({ from: userAccount });
        alert("签名成功!");
    } catch (error) {
        console.error("Error signing permit:", error);
        alert("签名授权时出错: " + error.message);
    }
}

async function transferTokens() {
    console.log("Transferring tokens...");
    // 在此处实现代币转移逻辑
    try {
        const amount = web3.utils.toWei('1', 'ether'); // 转移的代币数量
        await contract.methods.transferFrom(ownerAddress, userAccount, amount).send({ from: userAccount });
        alert("代币转移成功!");
    } catch (error) {
        console.error("Error transferring tokens:", error);
        alert("转移代币时出错: " + error.message);
    }
}
