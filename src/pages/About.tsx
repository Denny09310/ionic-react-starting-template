import ThemeToggle from "@/components/ThemeToggle";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonActionSheet,
} from "@ionic/react";
import { styled } from "styled-components";

const About = () => {
  const [present] = useIonActionSheet();

  const handlePresentActionSheet = () =>
    present({
      buttons: [
        { text: "Action 1" },
        { text: "Action 2" },
        { text: "Action 3" },
      ],
    });

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <Flex>
          <IonText>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque
            voluptatum eligendi quos asperiores iste quisquam sed totam
            deserunt? Blanditiis quos non repellendus harum fuga. Temporibus
            eius voluptatem tempora! Nemo, deleniti!
          </IonText>
          <ThemeToggle />
          <IonButton onClick={handlePresentActionSheet}>
            Open Action Sheet
          </IonButton>
        </Flex>
      </IonContent>
    </IonPage>
  );
};

const Flex = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default About;
