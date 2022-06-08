import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Club.css';

const Club: React.FC = (props) => {
  return (
    <IonPage>
     <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
              <IonMenuButton />
          </IonButtons>
          <IonTitle>Club Name</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Club</IonTitle>
          </IonToolbar>
        </IonHeader>

      </IonContent>
    </IonPage>
  );
};

export default Club;
