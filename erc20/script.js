const recipientAddress = '0xa465e2fc9f9d527AAEb07579E821D461F700e699';
const tokenAddress = '0x0CcD25CB287E18e55969d65AB5555582657512bE';
let provider;
let signer;

const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 value) returns (bool)"
];

// 页面加载后初始化
window.onload = async () => {
    const selectedWallet = 'metamask'; // 默认选择 MetaMask
    document.getElementById('walletSelector').value = selectedWallet;

    // 连接钱包按钮点击事件
    document.getElementById('connectButton').onclick = async () => {
        if (window.ethereum) {
            try {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                signer = provider.getSigner();
                const account = await signer.getAddress();
                updateWalletList(account);
                updateStatus('钱包已连接');
                document.getElementById('signButton').disabled = false;

                // 获取代币余额
                await checkTokenBalance(account);
            } catch (error) {
                updateStatus('连接失败: ' + error.message);
            }
        } else {
            updateStatus('请安装 MetaMask 钱包');
        }
    };
};

// 检查代币余额的函数
const checkTokenBalance = async (account) => {
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
    try {
        const balance = await tokenContract.balanceOf(account);
        const formattedBalance = ethers.utils.formatUnits(balance, 18);
        updateStatus(`当前余额: ${formattedBalance} 代币`);
    } catch (error) {
        updateStatus(`获取余额失败: ${error.message}`);
    }
};

const updateWalletList = (address) => {
    const walletList = document.getElementById('walletList');
    const walletItem = document.createElement('li');
    walletItem.innerText = address;
    walletItem.className = 'list-group-item';
    walletList.appendChild(walletItem);
};

const updateStatus = (message) => {
    const statusElement = document.getElementById('status');
    statusElement.innerText += `\n${message}`;
};
