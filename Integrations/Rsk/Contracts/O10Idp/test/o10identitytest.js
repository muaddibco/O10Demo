const Web3 = require("web3")

const O10Identity = artifacts.require("O10Identity");

describe("setScheme", () => {
  it("set scheme with 1 definition", async () => {
    let instance = await O10Identity.deployed();
    let tx = await instance.setScheme([{"AttributeName":"CertificateNumber","Alias":"Certificate Number","AttributeScheme":"DrivingLicense","IsRoot":true}])
    console.log(tx);
  });
});