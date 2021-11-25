import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native'
import { Camera } from 'expo-camera' 
import { storage } from "../firebase/config" //guardamos las fotos en firebase
import { set } from 'react-native-reanimated'

export default class camara extends Component {
    constructor(props) { 
        super(props) 
        this.state={
            permiso: false, 
            foto: "",
            mostrarcamara: true, 
        }
        this.camera //autoreferencia , es un componente que se instala de expo camara
    }
    componentDidMount(){ 
        Camera.requestCameraPermissionsAsync() 
            .then(()=>{ 
                this.setState({
                    permiso: true, 
                })
            })
            .catch( error => console.log(error)) 
    }

    takePicture(){ 
        this.camera.takePictureAsync() 
            .then((photo)=>{ // guardamos en el estado 
                this.setState({
                    foto: photo.uri, 
                    mostrarcamara:false
                }) 

            })
            .catch( error => console.log(error))
    }

    savePhoto(){ 
        fetch(this.state.foto) 
            .then( res => res.blob()) 
            .then( image =>{ 
                const ref = storage.ref(`photos/${Date.now()}.jpg`) 
                ref.put(image) //mete la imagen traducida en firebase
                    .then(()=>{
                        ref.getDownloadURL() //traeme el nuevo link de donde guardaste la foto
                            .then( url => { //ejecutamos la funcion
                                this.props.onImageUpload(url); //por props le pasa la url al componente padre
                                this.setState({ 
                                    foto:'', //borramos el link de la foto porque esta guardada en firebase
                                })
                            })
                            .catch(error=>console.log(error))
                    })
                    .catch( error => console.log(error))
            })
            .catch(error => console.log(error));

    }
clear(){
    this.setState({
        foto: "",
        mostrarcamara: true,

    })
}
    render() {
        return (
            <View style={styles.container}>
            {
                this.state.permiso ? 
                    this.state.mostrarcamara === false ? 
                    <React.Fragment> 
                        <Image 
                            style={styles.cameraBody}
                            source={{uri:this.state.foto}} //sacame la foto del link temporario
                        /> 
                        <View>
                            <TouchableOpacity onPress={()=>this.savePhoto()}> 
                              {/* muestro estos botones despues de que aparezca en falso */}
                                <Text>Aceptar</Text>  
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.clear()}>
                                <Text>Rechazar</Text> 
                                {/* saquemos nueva foto */}
                            </TouchableOpacity>
                        </View>
                    </React.Fragment>
                    :
                    //aca muestra la cámara
                    <View style={styles.container}>  
                        <Camera
                            style={styles.cameraBody}
                            type={Camera.Constants.Type.back}
                            ref={ reference => this.camera = reference } //referenciarte a this.camera
                        /> 

                        <TouchableOpacity style={styles.button} onPress={()=>this.takePicture()}> 
                            <Text>Sacar Foto</Text>
                        </TouchableOpacity>
                    </View> 
                :
                <Text>No tienes permisos para usar la cámara</Text> 

            }
            </View>
        )
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    cameraBody:{
        flex:7,
    },
    button:{
        flex:1,
        justifyContent: 'center',
    }
})