pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./Token.sol";
import "./ERC20.sol";
import "./ERC223.sol";
import "./ERC223ReceivingContract.sol";

contract PartyCoin is Token("PTY", "PartyCoin", 18, 1000000000000000000000000), ERC20, ERC223 
{
    address public creator;
    uint public ONE_TOKEN = 1000000000000000000;
    
    constructor() public {
        _balanceOf[msg.sender] = _totalSupply;
        creator = msg.sender;
    }
    
    function totalSupply() public view returns (uint) 
    {
        return _totalSupply;
    }
    
    function balanceOf(address _addr) public view returns (uint) 
    {
        return _balanceOf[_addr];
    }

    function transfer(address _to, uint _value) public returns (bool) 
    {
        if (_value > 0 && 
            _value <= _balanceOf[msg.sender] &&
            !isContract(_to)) {
            _balanceOf[msg.sender] -= _value;
            _balanceOf[_to] += _value;
            emit Transfer(msg.sender, _to, _value);
            return true;
        }
        return false;
    }

    function transfer(address _to, uint _value, bytes calldata _data) external returns (bool) 
    {
        if (_value > 0 && 
            _value <= _balanceOf[msg.sender] &&
            isContract(_to)) {
            _balanceOf[msg.sender] -= _value;
            _balanceOf[_to] += _value;
            ERC223ReceivingContract _contract = ERC223ReceivingContract(_to);
            _contract.tokenFallback(msg.sender, _value, _data);
            emit Transfer(msg.sender, _to, _value, _data);
            return true;
        }
        return false;
    }
    
    function isContract(address _addr) public view returns (bool) 
    {
        uint codeSize;
        assembly {
            codeSize := extcodesize(_addr)
        }
        return codeSize > 0;
    }

    function transferFrom(address _from, address _to, uint _value) public returns (bool) 
    {
        if (_allowances[_from][msg.sender] > 0 &&
            _value > 0 &&
            _allowances[_from][msg.sender] >= _value &&
            _balanceOf[_from] >= _value) {
            _balanceOf[_from] -= _value;
            _balanceOf[_to] += _value;
            _allowances[_from][msg.sender] -= _value;
            emit Transfer(_from, _to, _value);
            return true;
        }
        return false;
    }
    
    function approve(address _spender, uint _value) public returns (bool) 
    {
        _allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    function allowance(address _owner, address _spender) public view returns (uint) 
    {
        return _allowances[_owner][_spender];
    }
}