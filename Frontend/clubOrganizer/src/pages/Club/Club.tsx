import { IonButtons, IonCard, IonCardHeader, IonContent, IonGrid, IonHeader, IonItem, IonMenuButton, IonNote, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { fetchClubsAction, fetchOwnedAction, OwnedResult } from '../../services/actions/club';
import { loggedIn } from '../../services/actions/security';
import { RootState } from '../../services/reducers';
import { setActiveClub } from '../../services/rest/club';
import { loadUserData } from '../../services/rest/security';
import { Club } from '../../types/types';
import './Club.css';

const ClubPage: React.FC = (props) => {
  const {owned, myclubs } = useSelector((state: RootState) => state.clubs);
  const [ownedClub, setOwnedClub] = useState<any | null>(null)
  const [userclubs, setUserClubs] = useState<any | null>(null)
  const thunkDispatch: ThunkDispatch<RootState, null, OwnedResult> = useDispatch();
  
  
  useEffect(() => {
    if (!ownedClub) {
        thunkDispatch(fetchOwnedAction()).then(() => {
          setOwnedClub(owned);
        });
    }
    if (!userclubs) {
      thunkDispatch(fetchClubsAction()).then(() => {
        setUserClubs(myclubs);
      });
  }
}, [owned, myclubs]);



const ListOfMyClubs = ()=>{


  const clubs = myclubs
  if (clubs && clubs.length > 0){
    const list = clubs.map((club)=>{

      return (
        
          <IonCard  key={club.id} onClick={()=> setActiveClub(club.id)}>
          <IonCardHeader>{club.name}</IonCardHeader>
          <IonRow>Mitgliederanzahl: {club.memberIDs.length}</IonRow>
          </IonCard>   
       
      )
    })
  
    return <IonGrid><IonRow>{list}</IonRow></IonGrid>
  }

  return null;
  
}

const OwnedClub = ()=>{

  const club = owned;
  if (club){

      return (
        <IonRow>
          <IonCard onClick={()=> setActiveClub(club.id)}>
          <IonCardHeader>{club.name}</IonCardHeader>
          <IonRow>Mitgliederanzahl: {club.memberIDs.length}</IonRow>
          </IonCard>   
        </IonRow>
      )
    }
  

  return null;
  
}


  return (
    <IonPage>
     <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
              <IonMenuButton />
          </IonButtons>
          <IonTitle>Meine Clubs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Club</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          {owned != null? <IonNote>Owned</IonNote> : null}
        <OwnedClub/>
        {myclubs != null && myclubs.length >0? <IonNote>Meine Clubs</IonNote> : null}
        <ListOfMyClubs/>
        </IonGrid>

        

      </IonContent>
    </IonPage>
  );
};

export default ClubPage;
