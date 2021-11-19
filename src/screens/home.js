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
    db.collection('posts').orderBy('createdAt', 'desc').where('email','===', auth.currentUser.email).onSnapshot //te trae apenas lo pedis los post que sean mios ordenados (perfil)
    (docs =>{  //documentos que trae onSnapshots
        let posts = []; //seteamos a post vacio
        docs.forEach( doc => { 
        posts.push({
        id: doc.id, //le da su id
        data: doc.data() 
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
                data= {this.state.post} 
                keyExtractor={item=> item.id.toString()} //pasame el numero de id a letra 
                renderItem= {({item})=><Posteos data={item}/>} 
                /> 
        
            </View>
        )
    }
}
