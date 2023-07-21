// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MigrationToken is ERC20, ERC20Burnable, Ownable {
    uint256 ID = 1;
    mapping (address => uint256) GovernmentList;
    mapping (address => bool) User;
    mapping (address => mapping (address => uint256)) ExpireTime;
    mapping (address => mapping (address => uint256)) RentList;
    mapping (address => mapping (uint256 => Event)) EventList;
    mapping (address => mapping (string => uint256)) Goods;
    struct Gov {
        address Address;
        string name;
        uint256 id;
        uint256 eventNumber;
    }
    struct Event {
        string name;
        uint _reward;
    }

    Gov[] localgoverment;

    constructor() ERC20("MigrationToken", "MGT") {}

    modifier govOnly() {
        require(GovernmentList[msg.sender] != 0, "you are not government");
        _;
    }

    function mint(address to, uint256 amount) internal onlyOwner {
        _mint(to, amount);
    }
    //自治体の登録
    function register(address government,string memory _name) public onlyOwner() {
        require(GovernmentList[government] == 0, "already registeresd");
        GovernmentList[government] = ID;
        Gov memory LocalGoverment = Gov(government, _name, ID, 0);
        localgoverment.push(LocalGoverment);
        ID ++;
        mint(government, 1000);
    }
    //自治体から他の自治体へトークンの購入を希望
    function request(address to, uint256 amount) public payable govOnly() {
        require(amount%100 == 0, "Incorrect unit");
        uint256 tmp = amount / 100;
        uint256 time = block.timestamp;
        require(msg.value >= tmp*(1 ether),"not sufficient value");
        RentList[msg.sender][to] = msg.value;
        ExpireTime[msg.sender][to] = time;
    }
    //トークン購入を希望した自治体からトークンが送られてこない場合に，トークン購入希望を取り消し
    function retrieve(address to) public govOnly() {
        require(ExpireTime[msg.sender][to] >= 7 days, "time is leagal");
        uint256 Balance = RentList[msg.sender][to];
        payable(msg.sender).transfer(Balance);
        RentList[msg.sender][to] = 0;
        ExpireTime[msg.sender][to] = 0;
    }
    //他自治体から来たトークン購入希望を受諾
    function accept(address from) public govOnly() {
        uint256 tmp = RentList[from][msg.sender];
        require(tmp != 0,"request is not found");
        require(balanceOf(msg.sender) >= tmp, "STRANGE");
        transfer(from, tmp);
        RentList[from][msg.sender] = 0;
        ExpireTime[from][msg.sender] = 0;
    }

    //イベント登録
    function EventRegister(string memory _name, uint256 _amount) public govOnly() {
        Event memory newEvent = Event(_name, _amount);
        Gov storage tmp = localgoverment[GovernmentList[msg.sender]-1];
        uint256 id = tmp.eventNumber;
        EventList[msg.sender][id] = newEvent;
        tmp.eventNumber ++;
    }

    //イベント報酬配布
    function reward(address participant, uint256 _reward) internal {
        transfer(participant, _reward);
    }

    function provide_token(uint256 _eventnum, address[] memory participants) public govOnly() {
        Event memory newEvent = EventList[msg.sender][_eventnum];
        require(newEvent._reward >= 0, "event is not defined");
        for(uint i=0; i<participants.length; i++){
            reward(participants[i], newEvent._reward);
        }
    }

    //特産品の登録•削除
    function goodsope(bool flag, string memory goodsname, uint256 rate) public govOnly {
        if (flag == true) {
            Goods[msg.sender][goodsname] = rate;
        }
        else {
            Goods[msg.sender][goodsname] = 0;
        }
    }

    //トークンと特産品交換
    function exchange(address gov, string memory goods) public {
        uint256 amount = Goods[gov][goods];
        require(amount > 0, "goods is not defind");
        transfer(gov, amount);
    }

    function check() view public returns(uint256) {
        return address(this).balance;
    }

    function checkAccount(address acc) view public returns(bool,address) {
      if (GovernmentList[acc] == 0) {
        return (true,acc);
      }else {
        return (false, acc);
      }
    }
}