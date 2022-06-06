import { IonAvatar, IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import { alertCircleOutline, text } from 'ionicons/icons';
import {User, UserPatch} from '../types/types'
import './Profile.css';
import {useForm, Controller} from 'react-hook-form'
import { useState } from 'react';

const Profile: React.FC = () => {
 

  const initialValues:UserPatch = {
    firstname: 'john',
    lastname: 'doe',
    username: 'GigaJohn',
    password: 'asdfg',
    email: 'john.doe@example.com'
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
    setData(data)
    

    console.log(username, ',',firstname, ',',lastname);
    
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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
        <IonRow className='header'>GigaJohn</IonRow>
        <IonRow>john.doe@example.com</IonRow>
        <IonRow>John Doe</IonRow>
        <IonRow>Rolle: Administrator</IonRow>
        <IonRow>Gruppen: Klarinetten, Vorstand</IonRow>
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
