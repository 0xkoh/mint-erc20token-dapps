// SPDX-License-Identifier: UNLISCENSED
pragma solidity ^0.8.4;

interface ERC20 {
    
    function balanceOf(address account) external view returns (uint256);

    function decimals() external view returns (uint8);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);
 
}

contract TokenFaucet {
    
    ERC20 token;
    
    address owner;

    uint256 value;

    uint256 balance;
    
    constructor (address _tokenAddress, address _ownerAddress, uint256 _value) {
        token = ERC20(_tokenAddress);
        owner = _ownerAddress;
        value = _value;
    }
    
    modifier onlyOwner{
        require(msg.sender == owner,"Error: Caller not owner");
        _;
    }

    function mintToken(uint256 _amount) payable external {
        require(token.balanceOf(address(this)) >= _amount, "Error: ");
        require(msg.value == _amount / 1000 * value, "Error: ");
        
        balance += msg.value;
        token.transfer(msg.sender, _amount);
    }

    function setTokenAddress(address _addToken) external onlyOwner {
        token = ERC20(_addToken);
    }

    function setValue(uint256 _addValue) external onlyOwner {
        value = _addValue ;
    }
     
    function withdrawTokens(address _receiver, uint256 _amount) external onlyOwner {
        require(token.balanceOf(address(this)) >= _amount,"Error: ");
        token.transfer(_receiver, _amount);
    }

    function withdraw(uint256 _amount) external onlyOwner {
        require(balance >= _amount, "Error: ");
        balance -= _amount;
        (bool success, ) = payable(msg.sender).call{ value:_amount }("");
        require(success, "Error: ");
    }

    function getBalance() external view returns(uint256){
        return balance;
    }
}