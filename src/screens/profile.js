import React, { Component } from 'react'
import { Text, View, TouchableOpacity, FlatList} from 'react-native'
import Posteos from '../components/post'
import {db} from '../firebase/config'

export default class profile extends Component {
    constructor(props){
        super(props)
        this.state={}
    }
    componentDidMount(){

        db.collection('posts').orderBy('createdAt', 'desc').where('owner','==',this.props.user.email).onSnapshot //te trae apenas lo pedis los post donde el dueno es el email del usuario
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
    render() {
        return (
            <View>
               <Text> {this.props.user.email} </Text>
               <Text> {this.props.user.displayName} </Text>
               <Text> {this.props.user.metadata.lastSignInTime} </Text> 
               {/* metadata: info de firebase cuando pido el usuario, en este caso ultimo momento de inicio de sesion */}
               <FlatList 
                data= {this.state.post} //agarra una lista que se guarda en data
                keyExtractor={item=> item.id.toString()} //siempre necesito el id, pasame el numero de id a letra 
                renderItem= {({item})=><Posteos data={item}/>} // a cada conmponente le mando la data de un posteo 
                /> 
                < TouchableOpacity onPress={()=>this.props.logout()}> 
               <Text> Log Out </Text>
               </TouchableOpacity>
               
            </View>
        )
    }
}

