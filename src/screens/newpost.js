import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native' //componentes core (predefinidos de react)
import Camara from '../components/camara' //usamos este componente para crear un posteo 
import { auth, db } from '../firebase/config' 

export default class newpost extends Component {
    constructor(){
        super()
        this.state={
            mostrarcamara: true,
            url:'',
            textoPost: ''
        }
    }
    onImageUpload(url){ //le entra a una url que es el link de la imagen, yo tengo el url porque ya saq la foto, voy a gaurdar dentro de la url la informacion de img.
        this.setState({
            mostrarcamara: false,
            url: url
        })
    }
    submitPost(){

        db.collection('posts').add({ // a la collection de post agregale este post, adentro tiene los datos que le voy a guardar al post
            owner: auth.currentUser.email, 
            texto: this.state.textoPost, 
            createdAt: Date.now(), 
            photo: this.state.url, // me guarda en la base de datos la url q es el link d la imagen
            likes: [],
            comentarios:[],
        })
        .then( ()=>{ 
            this.setState({
                textoPost:'',
                mostrarcamara: true,
            })
            this.props.drawerProps.navigation.navigate('home')
        })
        .catch()
    }
    render() {
        return (
            <View style= {styles.container}>
                {this.state.mostrarcamara ? 
                <Camara onImageUpload={(url) => this.onImageUpload(url)}/>:
                <View >
                <TextInput
                    onChangeText={(text)=>this.setState({textoPost: text})} //guardo dentro de texto post la informacion que se escribe
                    placeholder='Escribí aquí'
                    keyboardType='default'
                    multiline
                    value={this.state.textoPost}    
                    />
                <TouchableOpacity onPress={()=>this.submitPost()}>
                    <Text>Guardar</Text>    
                </TouchableOpacity>
            </View>
                } 
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
})