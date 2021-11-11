import {Rep} from './styles'
import { useParams } from 'react-router'

const Repositorio = () =>{

    const {repositorio} = useParams();
    return(
        <h1>
            Repositorio <br/>
            {repositorio}
        </h1>
    )
}
export default Repositorio