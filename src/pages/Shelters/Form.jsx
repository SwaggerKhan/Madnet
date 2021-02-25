import { IonPage,IonList,IonLabel,IonContent, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonText} from '@ionic/react'
import { Link } from 'react-router-dom'
import { business } from 'ionicons/icons';
import React from 'react'

import { authContext } from "../../contexts/AuthContext"
import { dataContext } from "../../contexts/DataContext"
import Title from "../../components/Title"

const ShelterForm = () => {
    const {shelter_id} = useParams()
    const [shelter, setShelter] = React.useState([])
    const [authority, setAuthority] = React.useState([])
    const { callApi, unsetLocalCache} = React.useContext(dataContext)
    
    React.useEffect(() => {
        async function fetch() {
            const data = await callApi({graphql: `{center(id: ${shelter_id}) {
                name
            }}`, cache: false})
            
            setShelter(data)
        }

    }, [shelter_id])



    return(
        <IonPage>
            <Title name={ `Edit ${shelter.name}` } />
            <IonContent>
                <IonList>
                    <form onSubmit = {saveShelter}>

                    </form>
                </IonList>
            </IonContent>
        </IonPage>
    );
};