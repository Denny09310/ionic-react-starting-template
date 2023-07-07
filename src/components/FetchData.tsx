import { useGetWeatherForecastsQuery } from "@/api/weatherForecasts";
import {
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonRefresher,
  IonRefresherContent,
  RefresherCustomEvent,
} from "@ionic/react";
import { useRouteMatch } from "react-router";
import { styled } from "styled-components";

const FetchData = () => {
  const match = useRouteMatch();

  const { data, isLoading, refetch } = useGetWeatherForecastsQuery();

  const handleRefresh = (e: RefresherCustomEvent) =>
    refetch().then(() => setTimeout(e.detail.complete, 2000));

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>

      <IonLoading isOpen={isLoading} />
      <IonList lines="none">
        {data?.forecasts.map(
          ({ id, summary, date, temperatureC, temperatureF }) => (
            <IonItem
              key={id}
              routerLink={`${match.url}/forecast-details/${id}`}
            >
              <IonLabel>
                <h1>{summary}</h1>
                <p>{date}</p>
              </IonLabel>
              <span>
                {temperatureC} °C / {temperatureF} °F
              </span>
            </IonItem>
          )
        )}
      </IonList>
    </>
  );
};

export default FetchData;
