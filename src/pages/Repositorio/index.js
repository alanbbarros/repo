import {Container, Owner, Loading, BackButton, IssuesList} from './styles'
import { useParams } from 'react-router'
import api from '../../services/api'
import {useEffect, useState} from 'react';
import {FaArrowLeft} from 'react-icons/fa'

const Repositorio = () =>{

    const {repositorio} = useParams();
    const [repo, setRepo] = useState();
    const [issues, setIssues] = useState();
    const [loading, setLoading] = useState(true);



    useEffect(() =>{
        async function load(){
            const [repositorioData, issuesData ] = await Promise.all([
                api.get(`/repos/${repositorio}`),
                api.get(`/repos/${repositorio}/issues`, {
                    params:{
                        state: 'open',
                        per_page: 5
                    }
                })
            ])
            setRepo(repositorioData.data)
            setIssues(issuesData.data)
            setLoading(false)
        }

        load()
    }, [repositorio])

    if(loading){ 
        return(
            <Loading>
                <h1>Carregando...</h1>
            </Loading>  
        )

    }
    return(
        <Container>
            <BackButton to='/' >
                <FaArrowLeft size={25} />
            </BackButton>
            <Owner>
                <img src={repo.owner.avatar_url} alt='Foto' />
                <h1> {repo.name} </h1>
                <p> {repo.description} </p>
            </Owner> 

            <IssuesList>
                {
                    issues.map(issue =>{
                        return(
                            <li key={issue.id} > 
                                <img src={issue.user.avatar_url} alt={issue.user.login} />

                                <div>
                                    <strong>
                                        <a href={issue.html_url} > {issue.title} </a>
                                        
                                        {issue.labels.map(label =>{
                                            return(
                                                <span key={String(label.id) }> {label.name} </span>
                                            )
                                        })}

                                    </strong>
                                </div>
                            </li>
                        )
                    })
                }
            </IssuesList>
        </Container>
    )
}
export default Repositorio