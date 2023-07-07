import Tabs from "@/components/Tabs";
import { IonApp, setupIonicReact, useIonToast } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { reloadOutline } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import { useRegisterSW } from "virtual:pwa-register/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  const [presenToast] = useIonToast();

  const { updateServiceWorker } = useRegisterSW({
    onNeedRefresh: () =>
      presenToast({
        message: "There's an update available",
        buttons: [{ icon: reloadOutline, handler: updateServiceWorker }],
      }),
  });

  return (
    <IonApp>
      <IonReactRouter>
        <Route path="/tabs" render={(props) => <Tabs {...props} />} />
        <Redirect exact from="/" to="/tabs" />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
