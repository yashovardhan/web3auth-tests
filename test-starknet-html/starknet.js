const rpc = (() => {
  /**
   *
   * @param {*} provider - provider received from Web3Auth login.
   */
  const getStarkAccount = async (provider) => {
    try {
      const starkEc = StarkwareCrypto.ec
      const starkEcOrder = starkEc.n;
      const privKey = await provider.request({ method: "eth_private_key" });
      const account = starkEc.keyFromPrivate(StarkwareCrypto.grindKey(privKey, starkEcOrder), "hex");
      return account;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  /**
   *
   * @param {*} provider - provider received from Web3Auth login.
   */
  const getStarkKey = async (provider) => {
    try {
      const account = await getStarkAccount(provider);
      return account?.getPrivate("hex");
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  /**
   *
   * @param {*} provider - provider received from Web3Auth login.
   */
  const deployAccount = async (provider) => {
    try {
      const account = await getStarkAccount(provider);
      return fetch('/account.json')
        .then(response => response.json())
        .then(compiledArgentAccount => {
          console.log(defaultProvider)
          // const accountResponse = await defaultProvider.deployContract({
          //   contract: compiledArgentAccount,
          //   addressSalt: account.getPublic("hex"),
          // });
          // console.log(accountResponse)
          return ""
        });
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };
  return {
    getStarkAccount,
    getStarkKey,
    deployAccount
  }
})()