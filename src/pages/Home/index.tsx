import FetchData from "@/components/FetchData";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useRef } from "react";
import { Route, RouteComponentProps } from "react-router";
import ForecastDetails from "./ForecastDetails";

const HomeStack: React.FC<RouteComponentProps> = ({ match }) => {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Route exact path={match.url} component={HomeIndex} />
        <Route
          exact
          path={`${match.url}/forecast-details/:id`}
          component={ForecastDetails}
        />
      </IonRouterOutlet>
    </IonPage>
  );
};

const HomeIndex = () => {
  const presentingEl = useRef<HTMLElement>(null);

  return (
    <IonPage ref={presentingEl}>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <FetchData />
      </IonContent>
    </IonPage>
  );
};

export default HomeStack;
