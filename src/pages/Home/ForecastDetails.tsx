import { useGetWeatherForecastsQuery } from "@/api/weatherForecasts";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useMemo } from "react";
import { RouteComponentProps } from "react-router";

type MatchProps = { id: string };

const ForecastDetails: React.FC<RouteComponentProps<MatchProps>> = ({
  match,
}) => {
  const { data } = useGetWeatherForecastsQuery();

  const filteredData = useMemo(() => {
    const id = parseInt(match.params.id);
    return data?.forecasts.find((x) => x.id === id);
  }, [data]);

  const title = new Date(filteredData!.date).toDateString();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Home" />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <h2>Summary</h2>
        <p>{filteredData?.summary}</p>

        <h2>Temperatures</h2>
        <p>
          {filteredData?.temperatureC} °C / {filteredData?.temperatureF} °F
        </p>
      </IonContent>
    </IonPage>
  );
};

export default ForecastDetails;
