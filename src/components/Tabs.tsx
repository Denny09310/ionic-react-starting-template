import { About, Home } from "@/pages";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { homeOutline, informationCircleOutline } from "ionicons/icons";
import React from "react";
import { Redirect, Route, RouteComponentProps } from "react-router";

const generateRoutes = (match: RouteComponentProps["match"]) => {
  const baseUrl = match.url;
  const routes = {
    home: baseUrl + "/home",
    about: baseUrl + "/about",
  };
  return routes;
};

const Tabs: React.FC<RouteComponentProps> = ({ match }) => {
  const routes = generateRoutes(match);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path={routes.home} render={(props) => <Home {...props} />} />
        <Route exact path={routes.about} component={About} />
        <Redirect exact from={match.url} to={routes.home} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton href={routes.home} tab="home">
          <IonIcon aria-hidden={true} icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton href={routes.about} tab="about">
          <IonIcon aria-hidden={true} icon={informationCircleOutline} />
          <IonLabel>About</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
