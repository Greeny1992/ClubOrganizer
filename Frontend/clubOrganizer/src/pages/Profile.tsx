import { IonAvatar, IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import { alertCircleOutline, text } from 'ionicons/icons';
import {User} from '../types/types'
import './Profile.css';
import {useForm, Controller} from 'react-hook-form'
import { useState } from 'react';

const Profile: React.FC = () => {
 

  const initialValues:User = {
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

  const patchUserForm = ()=>{
    return (
      
	    <IonItem>
      <IonLabel>Gender</IonLabel>
        <IonSelect
          placeholder="Select One"
          name="gender"
        >
          <IonSelectOption value="FEMALE">Female</IonSelectOption>
          <IonSelectOption value="MALE">Male</IonSelectOption>
        </IonSelect>
      </IonItem>
    
    );
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
        <IonRow>john.doe@example.com - Administrator</IonRow>
        <IonRow>John Doe</IonRow>
        <IonRow>Eckertstraße 30i</IonRow>
        <IonRow>8020, Graz</IonRow>
        </IonCol>
      </IonRow>

      <IonRow className='header'>
        Account
      </IonRow>

      <IonRow>
      <form  onSubmit={ handleSubmit(onSubmit)  }>
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
          type='text'
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
