pragma solidity 0.5.4;

import 'ROOT/libraries/CloneFactory.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/libraries/collections/IMap.sol';


contract MapFactory is CloneFactory {
    function createMap(IAugur _augur, address _owner) public returns (IMap) {
        IMap _map = IMap(createClone(_augur.lookup("Map")));
        _map.initialize(_owner);
        return _map;
    }
}
