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

        db.collection('posts').add({ 
            owner: auth.currentUser.email, 
            texto: this.state.textoPost, 
            createdAt: Date.now(), 
            photo: this.state.url, 
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
                <Camara onImageUpload={(url) => this.onImageUpload(url)}/>: //las props que usa el componente hijo para mandar la url y la segunda es la funcion desarrollada en este componente
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