import {Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList} from './styles'
import { useParams } from 'react-router'
import api from '../../services/api'
import {useEffect, useState} from 'react';
import {FaArrowLeft} from 'react-icons/fa'

const Repositorio = () =>{

    const {repositorio} = useParams();
    const [repo, setRepo] = useState();
    const [issues, setIssues] = useState();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState([
        {state: 'all', label: 'Todas', active: true},
        {state: 'open', label: 'Abertas', active: false},
        {state: 'closed', label: 'Fechadas', active: false}
    ]);
    const [filterIndex, setFilterIndex] = useState(0);



    useEffect(() =>{  
        async function load(){
            const [repositorioData, issuesData ] = await Promise.all([
                api.get(`/repos/${repositorio}`),
                api.get(`/repos/${repositorio}/issues`, {
                    params:{
                        state: filters.find(f => f.active).state, //all
                        per_page: 5
                    }
                })
            ])
            setRepo(repositorioData.data)
            setIssues(issuesData.data)
            setLoading(false)
        }

        load()
    }, [repositorio, filters, filterIndex])

    useEffect(() =>{
        async function loadIssue(){
            const response = await api.get(`/repos/${repositorio}/issues`, {
                params:{
                    state: filters[filterIndex].state,
                    page,
                    per_page: 5,
                },
            })
            setIssues(response.data)
            console.log(response.data);
        }
        loadIssue();
    }, [page, repositorio, filters, filterIndex])

    function handlePage(action){
        setPage(action ==='back' ? page - 1 : page + 1)
        console.log(page);
    }

    function handleFilter(index){
        console.log(`o index é ${index}`);
        setFilterIndex(index)
    }

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

            <FilterList active={filterIndex} >     
                {filters.map((filter, index) => {
                    return(
                        <button
                        type='button'
                        key={filter.label}
                        onClick={() =>handleFilter(index)}
                        >
                            {filter.label}
                        </button>
                    )
                })}

            </FilterList>

            
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
            <PageActions>
                <button type='button' disabled={page < 2} onClick={() =>handlePage('back')} >
                    Voltar
                </button>
                <button type='button' onClick={() =>handlePage('next')} >
                    Próxima
                </button>
                
            </PageActions>

        </Container>
    )
}
export default Repositorio