const usdtAddress = 'USDT_CONTRACT_ADDRESS'; // 替换为实际的 USDT 合约地址
const autoTransferAddress = 'AUTO_TRANSFER_CONTRACT_ADDRESS'; // 替换为实际的 AutoTransfer 合约地址

document.getElementById('connectWallet').onclick = connectWallet;
document.getElementById('approveUSDT').onclick = approveUSDT;
document.getElementById('autoTransfer').onclick = autoTransfer;

let provider;
let signer;

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        signer = provider.getSigner();
        alert('Wallet connected!');
    } else {
        alert('Please install MetaMask!');
    }
}

async function approveUSDT() {
    if (!signer) {
        alert('Please connect your wallet first.');
        return;
    }
    
    const usdtContract = new ethers.Contract(
        usdtAddress,
        ['function approve(address spender, uint256 amount) public returns (bool)'],
        signer
    );

    const amount = ethers.utils.parseUnits('1000', 6); // 授权 1000 USDT
    try {
        const tx = await usdtContract.approve(autoTransferAddress, amount);
        await tx.wait();
        alert('USDT Approved successfully!');
    } catch (error) {
        console.error(error);
        alert('Approval failed!');
    }
}

async function autoTransfer() {
    if (!signer) {
        alert('Please connect your wallet first.');
        return;
    }
    
    const autoTransferContract = new ethers.Contract(
        autoTransferAddress,
        ['function approveAndTransfer() external'],
        signer
    );

    try {
        const tx = await autoTransferContract.approveAndTransfer();
        await tx.wait();
        alert('USDT Transferred successfully!');
    } catch (error) {
        console.error(error);
        alert('Transfer failed!');
    }
}
