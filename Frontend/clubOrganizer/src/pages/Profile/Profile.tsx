import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonMenuButton, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, RefresherEventDetail } from '@ionic/react';
import { alertCircleOutline, text } from 'ionicons/icons';
import {Club, Clubs, User, UserPatch} from '../../types/types'
import './Profile.css';
import {useForm, Controller} from 'react-hook-form'
import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../services/reducers';
import { ThunkDispatch } from 'redux-thunk';
import { fetchClubsAction, fetchClubsActions, fetchOwnedAction, fetchOwnedActions, OwnedResult } from '../../services/actions/club';
import { fetchClubs, fetchOwnedClub } from '../../services/rest/club';

const Profile: React.FC<RouteComponentProps<any>> = (props) => {
 
  const {user, authenticationInformation } = useSelector((state: RootState) => state.user);
  const token = useSelector((s:RootState) => s.user.authenticationInformation!.token || '');
  const {owned, myclubs, isLoading, errorMessage } = useSelector((state: RootState) => state.clubs);
  const [ownedClub, setOwnedClub] = useState<Club | null>(null)
  const [userclubs, setUserClubs] = useState<Clubs | null>(null)
  const thunkDispatch: ThunkDispatch<RootState, null, OwnedResult> = useDispatch();
  console.log(ownedClub);
  console.log(myclubs);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!isLoading) {
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
    
  }
}, [owned, myclubs]);

const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
  console.log('Begin async operation on Value List');
  fetchOwnedClub(token)
      .then(usr => dispatch(fetchOwnedActions.success(usr)))
      .then(() => event.detail.complete())
      .catch(err => dispatch(fetchOwnedActions.failure(err)))

  fetchClubs(token)
  .then(usr => dispatch(fetchClubsActions.success(usr)))
      .then(() => event.detail.complete())
      .catch(err => dispatch(fetchClubsActions.failure(err)))
}

  const initialValues:UserPatch = {
    firstname: user!.firstname,
    lastname: user!.lastname,
    username: user!.userName,
    password: user!.password,
    email: user!.email
  }

  const { control, register, handleSubmit, formState } = useForm({
    defaultValues: initialValues
  });

  const [data, setData] = useState();


  const onSubmit = (data:any) =>{
    const firstname = data.firstname;
    const lastname = data.lastname;
    const username = data.username;
    console.log("DATA: ", data);
    console.log(user);
    
    setData(data)
    
  }

  const userGroups = user!=null && user.groups.length > 0 ? user.groups : 'Noch in keiner Gruppe!'
  const clubOwned =  ownedClub!=null? ownedClub?.name : 'Noch kein eigener Club!'
  const otherClubs = myclubs!=null && myclubs.length > 0 ? myclubs.map(m=> m.name) : 'Noch keine anderen Clubs!'

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
              <IonMenuButton />
          </IonButtons>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
      <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
<IonCard>
  <IonCardContent>
    <IonGrid>
      <IonRow>
        <IonCol className='centered'>
        <IonAvatar className='avatar'><img src="https://cdn.pixabay.com/photo/2013/07/12/17/02/man-151714_960_720.png"/></IonAvatar>
        </IonCol>
        <IonCol>
        <IonRow className='header'>{user!.userName}</IonRow>
        <IonRow>Email: {user!.email}</IonRow>
        <IonRow>{user!.firstname + ' ' + user!.lastname}</IonRow>
        <IonRow>Mein Club: {clubOwned}</IonRow>
        <IonRow>Andere Clubs: {otherClubs}</IonRow>
        </IonCol>
      </IonRow>

      <IonRow className='header centered'>
        Account
      </IonRow>

      <IonRow className='centered'>
      <form className='table'  onSubmit={ handleSubmit(onSubmit)  }>
      <IonLabel>Firstname: </IonLabel>
      <IonItem>
      
        <IonInput
          {...register("firstname", {required:true})}
          placeholder="enter firstname"
          name="firstname"
          type='text'
        >
        </IonInput>
      </IonItem>
      <IonLabel>Lastname: </IonLabel>
      <IonItem>
      
        <IonInput
          {...register("lastname", {required:true})}
          placeholder="enter lastname"
          name="lastname"
          type='text'
        >
        </IonInput>
      </IonItem>
      <IonLabel>Username: </IonLabel>
      <IonItem>
      
        <IonInput
          {...register("username", {required:true})}
          placeholder="enter username"
          name="username"
          type='text'
        >
        </IonInput>
      </IonItem>
      <IonLabel>Email: </IonLabel>
      <IonItem>
      
        <IonInput
          {...register("email", {required:true})}
          placeholder="enter email"
          name="email"
          type='text'
        >
        </IonInput>
      </IonItem>
      <IonLabel>Password: </IonLabel>
      <IonItem>
      
        <IonInput
          {...register("password", {required:true})}
          placeholder="enter password"
          name="password"
          type='password'
        >
        </IonInput>
      </IonItem>
      <IonButton type='submit'>Submit</IonButton>
      </form>
      </IonRow>
    </IonGrid>
    

  </IonCardContent>
</IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
