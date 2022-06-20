import React, { useRef } from 'react';
import './form-builder.css'
import { closeCircle } from 'ionicons/icons';
import {
    IonButton,
    IonToast,
    IonItem,
    IonLabel,
    IonInput,
    IonIcon,
    IonDatetime,
    IonSelectOption,
    IonSelect,
    IonSpinner
} from '@ionic/react';
import { createCustomAction, createReducer } from 'typesafe-actions';
import { useDispatch, useSelector } from 'react-redux';
import { useFormState, StateValues, InputElement } from 'react-use-form-state';
import { TextFieldTypes } from '@ionic/core';

// Properties that belong to every field type
interface BaseField<T extends { [index: string]: any }> {
    name: keyof T;
    label: string;
    validators?: ((value: any, values?: StateValues<T>, event?: any) => string | undefined)[];
    position?: 'fixed' | 'stacked' | 'floating';
    color?: string;
}

// Properties specific to text fields
export interface TextFieldDescription<T extends { [index: string]: any }> extends BaseField<T> {
    type: TextFieldTypes;
}

// Properties specific to date fields
export interface DateFieldDescription<T extends { [index: string]: any }> extends BaseField<T> {
    type: 'date';
    min?: string;
    max?: string;
    displayFormat?: string;
}

// Properties specific to select fields
export interface SelectFieldDescription<T extends { [index: string]: any }> extends BaseField<T> {
    type: 'select';
    options: { key: any, value: string }[]
}

// Composed type made up of all supported field types
export type FieldDescriptionType<T> = TextFieldDescription<T> | DateFieldDescription<T> | SelectFieldDescription<T>

// Description of the entire form that is used for building
export interface FormDescription<T> {
    fields: FieldDescriptionType<T>[];
    name: string;
    submitLabel?: string;
    debug?: boolean
}

// Returns an object containing two action creators
// * loading: can be used to bring up a spinner in case of a long-running background operation
// * error: can be used to display an error message using a toast
const createActions = (name: string) => ({
    loading: createCustomAction<string,[boolean],{name:string, isLoading:boolean}>('form/loading', (isLoading) => ({ name, isLoading })),
    error: createCustomAction<string,[string],{name:string, errorMessage:string}>('form/error', (errorMessage: string) => ({ name, errorMessage }))
})

// Type of the redux-state that can be manipulated with 
// the loading and error actions
interface LoaderState {
    isLoading: boolean;
    errorMessage: string;
}

// Every form has it's own loader state associated to the 
// name of the form
interface FormBuilderState {
    [key: string]: LoaderState
}

// Type definition of the form actions
type FormActions =
    { type: 'form/loading', name: string, isLoading: boolean } |
    { type: 'form/error', name: string, errorMessage: string }

// The formBuilderReduce handles the form actions and needs to be 
// added to all other reducers of your application
export const formBuilderReducer = createReducer<FormBuilderState, FormActions>({})
    .handleType('form/error',
        (state, action) => ({ ...state, [action.name]: { ...state[action.name], errorMessage: action.errorMessage } }))
    .handleType('form/loading', (state, action) => ({ ...state, [action.name]: { ...state[action.name], isLoading: action.isLoading } }))

// Helper component for displaying the form state if debug is enabled
// in the FormDescription    
const DumpState = ({ debug, formState }: { debug: boolean | undefined, formState: {} }) =>
    debug ? <p>State: {JSON.stringify(formState)}</p> : <span></span>

const spinner = (isLoading: boolean) => isLoading ?
    (<IonSpinner />) : (<></>);

// The type of the form state as it is kept in the redux store    
interface FormBuilderReduxState {
    formBuilder: FormBuilderState
}

// The properties that need/can be passed to the final form component
// handleSubmit is a callback invoked when the form got subitted
// initialState can be used to provide initial values for the payload
export interface FormProps<T extends { [index: string]: any }> {
    handleSubmit: (entity: T) => void;
    initialState?: T
}

// The actual form builder that takes a FormDescription<T> as input
// and returns an object consisting of the following three properties:
// Form: a FunctionComponent with FormProps<T>
// loading: the loading action
// error: the error action
export const BuildForm = <T extends { [index: string]: any }>
    ({ fields, name, submitLabel, debug }: FormDescription<T>) => ({
        Form: ({ handleSubmit, initialState }: FormProps<T>) => {

            const [formState, { raw }] = useFormState(initialState);
            const { isLoading, errorMessage } =
                 useSelector<FormBuilderReduxState, LoaderState>(state => state.formBuilder[name] || {
                    isLoading: false,
                    errorMessage: ''
                }); 
                
            const dispatch = useDispatch();
            const myRef = useRef<HTMLIonInputElement>(null)

            const showError = (name: any) =>
                formState.errors[name] ?
                    <div className='field-error-msg'><IonIcon icon={closeCircle} color='red' /> {formState.errors[name]}</div>
                    : undefined

            const createTextField = <T extends { [index: string]: any }>({
                def, widgetState }: {
                    def: TextFieldDescription<T>,
                    widgetState: ReturnType<typeof raw>
                }) =>
                <IonItem key={def.name.toString()}>
                    <IonLabel position={def.position} color={def.color}>{def.label}</IonLabel>
                    <IonInput {...widgetState} {...{ type: def.type }} onIonChange={widgetState.onChange} ref={myRef} />
                    {showError(def.name)}
                </IonItem>

            const createDateField = <T extends { [index: string]: any }>({ def, widgetState }: {
                def: DateFieldDescription<T>,
                widgetState: ReturnType<typeof raw>
            }) => {
                const datePropsNames = ['min', 'max', 'displayFormat']
                const dateProps = Object.entries(def).reduce((acc, [key, value]) => value && datePropsNames.includes(key) ? { ...acc, [key]: value } : acc, {})
                return (
                    <IonItem key={def.name.toString()}>
                        <IonLabel position={def.position} color={def.color}>{def.label}</IonLabel>
                        <IonDatetime {...dateProps} onIonChange={widgetState.onChange} value={widgetState.value} />
                        {showError(def.name)}
                    </IonItem>
                )
            }

            const createSelectField = <T extends { [index: string]: any }>({ def, widgetState }: {
                def: SelectFieldDescription<T>,
                widgetState: ReturnType<typeof raw>
            }) => <IonItem key={def.name.toString()}>
                    <IonLabel position={def.position} color={def.color}>{def.label}</IonLabel>
                    <IonSelect onIonChange={widgetState.onChange} value={widgetState.value} >
                        {def.options.map(({ key, value }) => (<IonSelectOption key={key} value={key}>{value}</IonSelectOption>))}
                    </IonSelect>
                    {showError(def.name)}

                </IonItem>

            const fieldCreator = (def: FieldDescriptionType<T>, widgetState: ReturnType<typeof raw>) => {
                switch (def.type) {
                    case 'date': return createDateField({ def: (def as DateFieldDescription<T>), widgetState });
                    case 'select': return createSelectField({ def: (def as SelectFieldDescription<T>), widgetState });
                    default: return createTextField({ def: def as TextFieldDescription<T>, widgetState });
                }
            }

            const valueExtractor = (e: React.ChangeEvent<HTMLInputElement>) => e.target.value;
            const validator = (field: FieldDescriptionType<T>) => (
                value: string,
                values: StateValues<T>,
                event?: React.ChangeEvent<InputElement> | React.FocusEvent<InputElement>,
            ) => field.validators && field.validators.reduce((acc, validator) =>
                acc ? acc : validator(value, values, event)
                , undefined as undefined | string)

            const validateForm = () =>
                fields.map(f => f.validators && { name: f.label, error: validator(f)(formState.values[f.name], formState.values) })
                    .filter(result => result && result.error)

            const formIsValid = () => Object.keys(formState.validity).length > 0 &&
                Object.values(formState.validity).reduce((acc, value) => acc && value, true)

            return <div>
                <form onSubmit={
                    e => {
                        e.preventDefault();
                        const errors = validateForm();
                        if (errors.length > 0) {
                            const { error } = createActions(name);
                            dispatch(error(`<p>Form Errors:<p><ul>${errors.map(e => e && "<li>" + e.name + ": " + e.error + "</li>")}</ul>`))
                        } else {
                            handleSubmit(formState.values);
                        }
                    }
                } noValidate>
                    {fields.map(f => fieldCreator(f, raw({ name: f.name, onChange: valueExtractor, validate: validator(f) })))}
                    <IonButton type="submit" expand="block" disabled={!formIsValid()}>{spinner(isLoading)}{submitLabel}</IonButton>
                </form>
                <IonToast
                    isOpen={errorMessage ? errorMessage.length > 0 : false}
                    onDidDismiss={() => dispatch(createActions(name).error(''))}
                    message={errorMessage}
                    duration={5000}
                    color='danger'
                />
                <DumpState debug={debug} formState={formState} />
            </div>
        }
        ,
        ...createActions(name)
    })