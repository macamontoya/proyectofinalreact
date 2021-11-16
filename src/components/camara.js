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
        this.camera
    }
    componentDidMount(){ 
        Camera.requestCameraPermissionsAsync() //preguntamos si el usuario da permiso para sacar fotos
            .then(()=>{
                this.setState({
                    permiso: true, 
                })
            })
            .catch( error => console.log(error))
    }

    takePicture(){ //apreta el boton y se ejecuta esta funcion.
        this.camera.takePictureAsync() //saca la foto
            .then((photo)=>{ // guardamos en el estado
                this.setState({
                    foto: photo.uri, //guarda el link d la foto.
                    mostrarcamara:false
                }) 

            })
            .catch( error => console.log(error))
    }

    savePhoto(){ //guardo la foto en la base de datos
        fetch(this.state.foto) //anda a buscar esa foto al link
            .then( res => res.blob())//trae la foto, la traducimos a blob (res la foto)
            .then( image =>{ //una ves traducida la llamamos image 
                const ref = storage.ref(`photos/${Date.now()}.jpg`) //ref la guardamos en firebase, creamos el nombre de la foto y donde la vamos a guardar: la fecha.jpg
                ref.put(image) //mete la imagen traducida en firebase
                    .then(()=>{
                        ref.getDownloadURL() //traeme el nuevo link de donde guardaste la foto
                            .then( url => { //ejecutamos la funcion
                                this.props.onImageUpload(url); 
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
                this.state.permiso ? // tengo permiso para usarla si es verdadera
                    this.state.mostrarcamara === false ? //si es falso muestro la foto
                    //Render del preview
                    <React.Fragment>
                        <Image //muestra la foto
                            style={styles.cameraBody}
                            source={{uri:this.state.foto}} //lo que nosotros nos guardamos
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
                    //render de la cámara
                    <View style={styles.container}> 
                    {/* adentro tiene la camara y el boton sacar foto */}
                        <Camera
                            style={styles.cameraBody}
                            type={Camera.Constants.Type.back}
                            ref={ reference => this.camera = reference }
                        /> 
                        {/* componente camara, type que camara frontal o de atras. ref, que camara mostramos  */}

                        <TouchableOpacity style={styles.button} onPress={()=>this.takePicture()}> 
                            <Text>Sacar Foto</Text>
                        </TouchableOpacity>
                    </View> 
                :
                //render mensaje
                <Text>No tienes permisos para usar la cámara</Text> // si no tengo permiso

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