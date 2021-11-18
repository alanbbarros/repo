import React, {useState, useCallback, useEffect} from 'react'
import {FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa'
import {Container, Form, SubmitButton, List, DeleteButton} from './styles'
import api from '../../services/api'
import {Link} from 'react-router-dom'

const Main = () =>{

    const [newRepo, setNewRepo] = useState('')
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(null)

    useEffect(() =>{
        const repoStorage = localStorage.getItem('repos')
        if(repoStorage){
            setRepositorios(JSON.parse(repoStorage))
        }
    }, [])

    useEffect(() =>{
        function addRepoToLocalStorage(){
            localStorage.setItem('repos', JSON.stringify(repositorios))
        }
        addRepoToLocalStorage()
    }, [repositorios])



    const handleSubmit = useCallback(e => {
        e.preventDefault();
        async function submit(){
            setLoading(true)
            setAlert(null)
            try{
                setNewRepo(newRepo.trimEnd())
                if(newRepo === ''){
                    throw new Error('Indique um repositório')
                }

                const response = await api.get(`repos/${newRepo}`)

                const hasRepo = repositorios.find(repo => repo.name === newRepo)
                
                if(hasRepo){
                    throw new Error('Repositorio já adicionado')
                }
                const data ={
                    name: response.data.full_name,
                }
                setRepositorios([...repositorios, data])
                setNewRepo('')
            }
            catch(e){
                console.log(e.message);
                setAlert(true)
            }
            finally{
                setLoading(false)
            }
        }
        submit();
    }, [newRepo, repositorios]);

    function handleInputChange(e){
        let repo = e.target.value.trimEnd()
        setNewRepo(repo)
        setAlert(null)
    }

    const handleDelete = useCallback(repo => {
        const find = repositorios.filter(r => r.name !== repo)
        setRepositorios(find)
    }, [repositorios])

    return(
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus repositórios 
            </h1>
 
            <Form onSubmit={e => handleSubmit(e)} error={alert} >
                <input 
                type='text' 
                placeholder='Adicionar repositórios'
                value={newRepo}
                onChange={e => handleInputChange(e)}
                />
                <SubmitButton loading={loading ? 1 : 0} >
                    {
                        loading ? 
                        (<FaSpinner size={14} color='white' />)
                        :
                        (<FaPlus size={14} color='white' />)
                    }
                </SubmitButton>
            </Form>

            <List>
                {
                repositorios.map(repo =>(
                    <li key={repo.name} >
                        <span>
                            <DeleteButton onClick={() =>handleDelete(repo.name)} >
                                <FaTrash size={14} />
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`} >
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))
                }
            </List>

        </Container>
    )
}
export default Main