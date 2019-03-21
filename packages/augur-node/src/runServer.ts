import { Augur } from "./types";
import { AugurNodeController } from "./controller";
import { logger } from "./utils/logger";
import { ConnectOptions } from "./setup/connectOptions";

import { EthersProvider } from "@augurproject/ethersjs-provider";
import { JsonRpcProvider } from "ethers/providers/json-rpc-provider";
import { addresses, uploadBlockNumbers } from "@augurproject/artifacts";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { EthersProviderBlockStreamAdapter } from "blockstream-adapters";

export async function start(retries: number, config: ConnectOptions, databaseDir: string, isWarpSync: boolean) {
  const ethersProvider = new EthersProvider(new JsonRpcProvider("https://eth-rinkeby.alchemyapi.io/jsonrpc/Kd37_uEmJGwU6pYq6jrXaJXXi8u9IoOM"), 5, 0, 40);
  const BlockStreamAdapter = new EthersProviderBlockStreamAdapter(ethersProvider);
  const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined);
  const augur = await Augur.create(ethersProvider, contractDependencies, addresses[4]);

  const augurNodeController = new AugurNodeController(augur, config, databaseDir, isWarpSync);

  function errorCatch(err: Error) {
    function fatalError(e: Error) {
      logger.error("Fatal Error:", e);
      process.exit(1);
    }
    if (retries > 0) {
      logger.warn(err.message);
      retries--;
      augurNodeController.shutdown().catch(fatalError);
      setTimeout(() => start(retries, config, databaseDir, isWarpSync), 1000);
    } else {
      fatalError(err);
    }
  }

  augurNodeController.start(errorCatch).catch(errorCatch);
}

if (require.main === module) {
  const retries: number = parseInt(process.env.MAX_SYSTEM_RETRIES || "1", 10);
  const isWarpSync = process.env.IS_WARP_SYNC  === "true";
  const databaseDir = process.env.AUGUR_DATABASE_DIR || ".";
  const config = ConnectOptions.createFromEnvironment();

  start(retries, config, databaseDir, isWarpSync);
}
