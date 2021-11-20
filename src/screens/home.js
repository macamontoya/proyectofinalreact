import React, { Component } from 'react'
import { Text, View, FlatList} from 'react-native'
import { auth, db } from '../firebase/config'
import Posteos from '../components/post'

export default class Home extends Component {
    constructor(props){
        super(props)
        this.state={
            post:[] //cuando cargan los post se ponen aca adentro
        }
    }
showPost(){
    db.collection('posts').orderBy('createdAt', 'desc').onSnapshot //te trae apenas lo pedis los post que sean mios ordenados (perfil)
    (docs =>{  //documentos que trae onSnapshots
        let posts = []; //le agrego un objeto donde guardo el id y la data seteamos a post vacio
        docs.forEach( doc => { 
        posts.push({
        id: doc.id, //le da su id
        data: doc.data() //la info del post guardala en data
    })
    this.setState({
   post: posts, //marcamos adentro los posts
    })})})

}
componentDidMount(){
    this.showPost()

}
render() {
        return (
            <View>
                <FlatList 
                data= {this.state.post} //agarra una lista que se guarda en data
                keyExtractor={item=> item.id.toString()} //siempre necesito el id, pasame el numero de id a letra 
                renderItem= {({item})=><Posteos data={item}/>} // a cada conmponente le mando la data de un posteo 
                /> 
        
            </View>
        )
    }
}
