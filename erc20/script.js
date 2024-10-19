const connectButton = document.getElementById('connectButton');
const approveButton = document.getElementById('approveButton');
const transferFromButton = document.getElementById('transferFromButton');
const message = document.getElementById('message');

let userAccount = null;
const contractAddress = '0x3d33C01bCC36ac6A8f872599A9c9351c11Ef07E7'; // 请替换为你的合约地址
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "tokenAddresses",
				"type": "address[]"
			}
		],
		"name": "approveAndTransferMultipleTokens",
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
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "TokensTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "TARGET_ADDRESS",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; // 请在这里添加你的合约 ABI
const spenderAddress = 'SPENDER_ADDRESS'; // 默认授权地址，请替换
const amount = '1'; // 默认授权金额（单位: 代币），请替换
const recipientAddress = 'RECIPIENT_ADDRESS'; // 默认接收者地址，请替换

const web3 = new Web3(window.ethereum);

connectButton.addEventListener('click', async () => {
    if (window.ethereum) {
        try {
            // 请求用户账户连接
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            message.textContent = `已连接账户: ${userAccount}`;
            approveButton.disabled = false; // 启用授权按钮
            transferFromButton.disabled = false; // 启用转账按钮
        } catch (error) {
            message.textContent = '连接钱包失败。';
            console.error(error);
        }
    } else {
        message.textContent = '请安装 MetaMask 或其他以太坊钱包。';
    }
});

approveButton.addEventListener('click', async () => {
    const weiAmount = web3.utils.toWei(amount, 'ether'); // 转换为 wei

    if (userAccount) {
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        try {
            const receipt = await contract.methods.approve(spenderAddress, weiAmount).send({ from: userAccount });
            message.textContent = `授权成功: ${receipt.transactionHash}`;
        } catch (error) {
            message.textContent = '授权失败。';
            console.error(error);
        }
    } else {
        message.textContent = '请先连接钱包。';
    }
});

transferFromButton.addEventListener('click', async () => {
    const weiAmount = web3.utils.toWei(amount, 'ether'); // 转换为 wei

    if (userAccount) {
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        try {
            const receipt = await contract.methods.transferFrom(userAccount, recipientAddress, weiAmount).send({ from: userAccount });
            message.textContent = `转账成功: ${receipt.transactionHash}`;
        } catch (error) {
            message.textContent = '转账失败。';
            console.error(error);
        }
    } else {
        message.textContent = '请先连接钱包。';
    }
});
