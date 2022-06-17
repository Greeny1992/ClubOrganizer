import React, {useEffect, useState} from 'react'
import {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonBackButton,
    IonTitle,
    IonContent,
    IonPage,
    IonSpinner,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonItem,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonLabel, IonToast
} from '@ionic/react';
import {Group, User} from '../../../types/types';
import * as Validator from '../../../helpers/validators';
import {RouteComponentProps} from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import { executeDelayed } from '../../../helpers/async-helpers';
import { BuildForm, FieldDescriptionType, FormDescription } from '../../../utils/form-builder';
import {register} from "../../../services/rest/users";
import {RootState} from "../../../services/reducers";

import {fetchUserAction} from "../../../services/actions/users";
import { addGroupToClub } from '../../../services/rest/club';
import { fetchOwnedAction } from '../../../services/actions/club';



const form= (mode: string): FormDescription<Group> => ({
    name: 'registrationGroups',
    fields: [
        {
            name: 'description', label: 'Decription', type: 'text', position: 'floating',
            color: 'primary', validators: [Validator.required, Validator.minLength(4)]
        },
        {
            name: 'name', label: 'Name', type: 'text', position: 'floating',
            color: 'primary', validators: [Validator.required, Validator.minLength(4)]
        }
    ],
    submitLabel:  mode === 'add' ? 'Save' : 'Update',
});

export default (mode: 'add' | 'edit'): React.FC<RouteComponentProps<{ id: string }>> => ({ history, match }) => {

    const dispatch = useDispatch();
    const token = useSelector((s:RootState) => s.user.authenticationInformation!.token || '');
    const { owned, isLoading, errorMessage } = useSelector((s:RootState) => s.clubs);
    const [selectedGroup, setSelectedGroup] = useState ({} as Group | undefined)

    const {Form, loading , error} = BuildForm(form(mode));

    useEffect(() => {
        console.log(owned?.groups.find(x=> x.id == match.params.id));
        
        if(mode == 'edit' && (!owned || owned.groups.find(x=> x.id == match.params.id) != null))
        {
            dispatch(fetchOwnedAction());

            if(owned != null && typeof owned.groups.find(x=> x.id == match.params.id) != typeof undefined){
                const g = owned.groups.find(x=> x.id == match.params.id)
                setSelectedGroup(g)
                console.log(selectedGroup);
                
            }
            
        }
    })


    const submit = (group: Group) => {
        dispatch(loading(true));
        if(owned != null){
            addGroupToClub(token, owned.id, group)
            .then((result: {}) => {
                executeDelayed(100,() => history.replace('/groups'))
            })
            .catch((err: Error) => {
                dispatch(error(err.message))
            })
            .finally(() => dispatch(loading(false)))
        }
        
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/login"/>
                    </IonButtons>
                    <IonTitle>{mode === 'add' ? 'New' : 'Edit'} Group {mode === 'edit' ? selectedGroup?.name : ""}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                {isLoading ? <IonItem><IonSpinner />Loading User...</IonItem> :
                    mode === 'edit' ?  <Form handleSubmit={submit} initialState={selectedGroup!}/> :  <Form handleSubmit={submit} />

                }
            </IonContent>
        </IonPage>
    )
}