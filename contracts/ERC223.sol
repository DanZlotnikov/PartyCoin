pragma solidity ^0.5.0;

    interface ERC223 {
        function transfer(address _to, uint _value, bytes calldata _data) external returns (bool);
        event Transfer(address indexed from, address indexed to, uint value, bytes data);
    }