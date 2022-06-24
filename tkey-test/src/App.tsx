import { useEffect, useState } from "react";

import logo from './logo.svg';
import './App.css';
import ThresholdKey from "@tkey/default";
import WebStorageModule, { WEB_STORAGE_MODULE_NAME } from "@tkey/web-storage";
import TorusServiceProvider from "@tkey/service-provider-torus";
import TorusStorageLayer from '@tkey/storage-layer-torus';

function App() {

  const [tKey, setTKey] = useState<ThresholdKey | null>(null);

  useEffect(() => {
    const init = async () => {
      try {

        const serviceProvider = new TorusServiceProvider({
          directParams: {
            baseUrl: `${window.location.origin}/serviceworker`,
            enableLogging: true,
            network: "testnet" // details for test net
          },
        });

        const storageLayer = new TorusStorageLayer({ hostUrl: "https://metadata.tor.us" });

        const tkey = new ThresholdKey({
          modules: {
            // More modules can be passed to create additional shares.
            [WEB_STORAGE_MODULE_NAME]: new WebStorageModule(),
          },
          serviceProvider,
          storageLayer,
        });

        setTKey(tkey);


        const reconstructedKey = await tkey.reconstructKey();

      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
