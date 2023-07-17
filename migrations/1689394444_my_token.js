const MyContract = artifacts.require('./MigrationToken.sol');

module.exports = function (deployer) {
  deployer.deploy(MyContract);
};