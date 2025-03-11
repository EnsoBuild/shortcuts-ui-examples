import { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { setApiKey } from "@/service/enso";
import Providers from "@/Providers";
import Home from "@/components/Home";
import { ColorModeButton } from "@/components/ui/color-mode";
import { Provider } from "@/components/ui/provider";

import logoUrl from "./logo_black_white.png";

function App() {
  useEffect(() => {
    setApiKey(import.meta.env.VITE_ENSO_API_KEY);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Provider>
        <Providers>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "5px",
            }}
          >
            <img src={logoUrl} alt={"Enso"} style={{ height: "50px" }} />

            <div
              style={{
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              <ColorModeButton />

              <ConnectButton />
            </div>
          </div>
          <Home />
        </Providers>
      </Provider>
    </div>
  );
}

export default App;
