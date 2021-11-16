import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import Camara from '../components/camara'
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
    onImageUpload(url){
        this.setState({
            mostrarcamara: false,
            url: url
        })
    }
    submitPost(){

        db.collection('posts').add({ // a la collection de post agregale este post, adentro tiene los datos que le voy a guardar al post
            owner: auth.currentUser.email, //usuario logeado, quiero el email
            texto: this.state.textoPost, // descripcion del text
            createdAt: Date.now(),
            photo: this.state.url, //link d foto
        })
        .then( ()=>{ //Limpiar el form de carga
            this.setState({
                textoPost:'',
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
                    onChangeText={(text)=>this.setState({textoPost: text})}
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