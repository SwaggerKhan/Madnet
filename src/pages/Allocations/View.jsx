import { IonPage,IonList,IonItem,IonLabel,IonContent, IonButton } from '@ionic/react'
import React from 'react'

import './View.css'
import { dataContext } from "../../contexts/DataContext"
import { useParams } from "react-router-dom"
import Title from "../../components/Title"
import { appContext } from '../../contexts/AppContext'
import { PROJECT_KEYS } from "../../utils/Constants"

const TeacherView = () => {
    const { shelter_id, project_id } = useParams()
    const { callApi, cache, unsetLocalCache } = React.useContext(dataContext)
    const [ batches , setBatches ] = React.useState([])
    const [ shelter, setShelter ] = React.useState("")
    const [ batch_id ]  = React.useState([])
    const [ level_id ] = React.useState([])
    const [ teacher_id ] = React.useState([])
    const { showMessage } = React.useContext(appContext)

    React.useEffect(() => {
        async function fetchMapping() {
            const data =  await callApi({graphql: `{
                center(id: ${shelter_id}) { name }
                batchSearch(center_id:${shelter_id}, project_id: ${project_id}) {
                    id batch_name 
                    allocations {
                      role
                      user {
                        id name
                      }
                      level {
                        id level_name
                      }
                      subject {
                        id name
                      }
                    }
                }
              }`, cache: true, cache_key: `teacher_view_${shelter_id}_${project_id}`});
            
            setShelter(data.center.name)
            setBatches(data.batchSearch)
            
        } 
        if(cache[`teacher_view_${shelter_id}_${project_id}`] === undefined || !cache[`teacher_view_${shelter_id}_${project_id}`]){
            fetchMapping()
        }
    }, [shelter_id, project_id, cache[`teacher_view_${shelter_id}_${project_id}`]])


    const deleteMapping = (x) => {
        callApi({url:`/batches/${batch_id[x]}/levels/${level_id[x]}/teachers/${teacher_id[x]}`, method: 'delete'}).then(()=>{
            showMessage("Deleted")
            unsetLocalCache(`teacher_view_${shelter_id}_${project_id}`)
        })
    }

    return(
        <IonPage>
            <Title name={`Assigned Teachers at ${shelter} (${PROJECT_KEYS[project_id]})`} back={ `/shelters/${shelter_id}/projects/${project_id}` }  />
            <IonContent className="dark">
                <IonItem routerLink = {`/shelters/${shelter_id}/projects/${project_id}/assign-teachers`} routerDirection = "none" >
                    <IonButton> Add New Teacher</IonButton>
                </IonItem>

                <IonList>
                    {(batches.map((batch, index) => {
                        if(batch.allocations.length > 0) {
                            return( 
                                <IonItem key={index}>
                                    <div className="batch-area">
                                        <IonLabel><h1>{batch.batch_name}</h1></IonLabel>
                                        <IonList>
                                            {(batch.allocations.map((alloc, ind) =>{
                                                batch_id[ind] = batch.id 
                                                teacher_id[ind] = alloc.user.id
                                                level_id[ind] = alloc.level.id
                                                return(
                                                    <IonItem key={ind} className="striped"> 
                                                        <IonLabel className="allocation-info">  
                                                            <p>Teacher: {alloc.user.name}</p>
                                                            <p>Class Section: {alloc.level.level_name}</p>
                                                            {(alloc.subject != null) ? 
                                                                <p>Subject: {alloc.subject.name}</p> 
                                                                : <p>Subject: None </p>
                                                            }
                                                        </IonLabel>
                                                        <IonButton slot="end" onClick={() => deleteMapping(ind) }>Delete</IonButton>
                                                    </IonItem>  
                                                );
                                            }))
                                            }
                                        </IonList>
                                    </div>
                                </IonItem>
                            )
                        }
                    }))}
                </IonList>
            </IonContent> 
        </IonPage>
    );
};

export default TeacherView