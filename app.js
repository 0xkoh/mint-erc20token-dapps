let web3 = null;
let accounts = null;
let account = null;

//Metamaskへ接続する関数。
const connect = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            web3 = await new Web3((new Web3.providers.HttpProvider("gethプロバイダーのアドレス")));
            await ethereum.request({ 
                method: 'wallet_switchEthereumChain', 
                params: [{ chainId: 'コントラクトをデプロイしたチェーンのID' }],
            });

            connectBtn.innerHTML = accounts[0];
            account = accounts[0].slice(2);
        } catch (error) {
            alert('トランザクションが拒否されました');
        }
    } else {
        alert('Metamaskをインストールしてください');
    }
}

//ERC20トークンをmintするメソッドを叩きに行く関数。
const mintToken = async () => {
    let amount = document.getElementById("amount");
    amount = amount.value;

    let data = web3.utils.toWei(amount, 'ether');
    data = web3.eth.abi.encodeParameter('uint256', data).slice(2);

    let value = web3.utils.toWei(amount, 'milliether');
    value = web3.utils.numberToHex(value);
    
    try{
        await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
                    from: accounts[0],
                    to: 'コントラクトアドレス',
                    gasLimit: "21000",
                    data: '0xc634d032' + data,
                    chainId: 'チェーンID',
                    value: value,
                },
            ],});
    } catch{
        alert('Metamaskと接続してください');
    }
}


// Metamaskへトークンを追加するメソッドを実行する関数。
const addToken = async () => {
    await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
            type: 'ERC20',
            options: {
                address: 'トークンアドレス', 
                symbol: 'トークンのシンボル', 
                decimals: 18, 
                image: '画像URL',
            },
        },
    })
}