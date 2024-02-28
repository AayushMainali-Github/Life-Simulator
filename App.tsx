import Navigation from "./Components/Navigation";
import { useEffect, useState } from "react";
import { checkUserStatus, initializeUser } from "./LocalStorage/User";
import { InvestmentsImages } from "./constants/images";

export default function App() {
  //loading data
  const [loaded, setLoaded] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      //check status
      const status = await checkUserStatus();
      if (status === 0) await initializeUser();

      //update
      setLoaded(true);
    })();
  }, []);

  if (loaded)
    return (
      <>
        <Navigation />
      </>
    );
}
