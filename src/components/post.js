import React, { Component } from 'react';
import { auth, db } from "../firebase/config";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TextInput} from 'react-native'
import firebase from "firebase"
import { Modal } from 'react-native';


class Posteos extends Component {
    constructor(props) { 
        super(props)
        this.state = {
            likes: 0, //cero likes 
            MeGusta: false, //el usuario no likeo
            showModal: false, //comentarios
            comments: [], //lista de coments
            comment:'', //para escribir el coment
        }
    }

    componentDidMount() {
        console.log(this.props.data);
        if(this.props.data.data.likes){ //existen likes?
            this.setState({ //ponemos el estado segun los likes que tenga guardados en firebase
                likes: this.props.data.data.likes.length, //guardo la cantidad de likes que hay en el post
                MeGusta: this.props.data.data.likes.includes(auth.currentUser.email) // esta  mi like en la lista
            }) //preguntamos si el usuario likeo la foto, si esta likeadp marco el like.
       
        }
        if(this.props.data.data.comments){
            this.setState({
                comments:this.props.data.data.comments
            })

        }
       
    }
    
    MeGusta() {
        let post = db.collection("posts").doc(this.props.data.id); 

        post.update({ //actualiza el campo likes
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)// el valor que estaba antes, como es una lista de emails ()arrayunion sumale mi like 
        })
        .then(() => {
            this.setState({
                likes: this.props.data.data.likes.length, //vuelvo a traerme la cant de likes
                MeGusta: true //mi like existe
            })
        })
        .catch((error) => {
            console.error("Error updating document: ", error); 
        });
    }
        
    noMeGusta() {
            let post = db.collection("posts").doc(this.props.data.id);  //colleccion d post en este en particular
    
            post.update({
                likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email) //array remove, saca mi email de lista d likes. se fija en firebase si el usuario tiene likeadfo la foto y lo saca si esta  
            })
            .then(() => {
                this.setState({
                    likes: this.props.data.data.likes.length,
                    MeGusta: false
                })
            })
            .catch((error) => {
                console.error("Error updating document: ", error); 
            });
        }
         //desde newpost le paso la info al post
     
         openModal() {
            this.setState({
                showModal: true
            })
        }
    
        closeModal() {
            this.setState({
                showModal: false
            })
        }
    
        guardarComentario(){
            console.log('Guardando comentario...');
            let oneComment = {
                createdAt: Date.now(),
                author: auth.currentUser.displayName,
                comment: this.state.comment, //uso lo de linea 15, lleno el estado vacio 
            }
             db.collection('posts').doc(this.props.data.id).update({
               comments:firebase.firestore.FieldValue.arrayUnion(oneComment)
            })
            .then(()=>{
                this.setState({
                 comments:this.props.data.data.comments, //actualizo la lista de comments 
                    comment:''
                })
            }
            )}
    
            showModal() {
                this.setState({
                    showModal: true
                })
            }
    
            hideModal() {
                this.setState({
                    showModal: false
                })
            }
            borrarPost = (id) => {
                db.collection('posts').doc(id).delete()
               
            }
            
    
           
    
    
    
        
        render(){
            return (
            <View style={styles.container}>
                <View style={styles.Foto}>
                    <Image style={styles.imagen} source={{uri:this.props.data.data.photo}}></Image> 
                    {/* cuando busco la imagen en un link, por eso usamos uri: */}
                </View>
               
                {/* Botones de los posteos */}
                    
                <View style={styles.icons}>
                    {
                        ! this.state.MeGusta ?
                            <TouchableOpacity style={styles.button} onPress={() => this.MeGusta()}>
                                <Text>{this.state.likes}</Text>
                                <Image style={styles.Icons} source={{uri: "https://img.icons8.com/material-outlined/24/000000/hearts.png"}}></Image> 
                            </TouchableOpacity>
                        :
                            <TouchableOpacity style={styles.button} onPress={() => this.noMeGusta()}>
                                <Text>{this.state.likes}</Text>
                                <Image style={styles.Icons} source={{  uri: "https://img.icons8.com/fluency/48/000000/like.png"}}></Image>
                            </TouchableOpacity>
                    }
                    {/* <TouchableOpacity style={styles.button} onPress={() => this.openModal()}>
                        <Text>{this.props.data.data.comments.length}</Text>
                        <Image style={styles.Icons} source={{uri: "https://img.icons8.com/material-outlined/24/000000/speech-bubble.png"}}></Image>
                    </TouchableOpacity> */}  
                    {/* ESTO LO VAMOS A USAR PARA LOS COMENTARIOS */}
                </View>
    
                    {/* Modal para comentarios */}
    
                {   this.state.showModal ?
                    <Modal style={styles.modalContainer}
                        visible={this.state.showModal}
                        animationType='slide'
                        transparent={false}
                    >   
                        <TouchableOpacity onPress={()=>this.hideModal()}>
                            <Text style={styles.closeButton}>X</Text>
                        </TouchableOpacity> 
                        {this.state.comments.length > 0 ? //si la lista tiene mas de 0, hago la flat, sino no com
                            <FlatList
                        data={this.state.comments}
                        keyExtractor={comment=>comment.createdAt.toString()} //equivalente al id, uso la hora del posteo, lo paso a texto pq necesito para keyExt
                        renderItem={({item})=>(<Text>{item.author}: {item.comment}</Text> )}/>
                        :
                        <Text>No hay comentarios</Text>
                    }
                       

                        <View>
                            <TextInput 
                                style={styles.input}
                                placeholder="Comentar..."
                                keyboardType="default"
                                onChangeText={text => this.setState({comment: text})}
                                value={this.state.comment}
                            />
                            <TouchableOpacity 
                            style={styles.buttonModal}
                            onPress={()=>{this.guardarComentario()}}>
                                <Text style={styles.buttonText}>Guadar comentario</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>    
                    :
                    <TouchableOpacity onPress={()=>this.showModal()}>
                    <Text style={styles.closeButton}>Ver Comentarios</Text>
                </TouchableOpacity> 
                } 
                
            <Text style={styles.Titulo}>{this.props.data.data.texto}</Text>
            </View>
            )
        }       
    }
    
    const styles = StyleSheet.create({
        container:{
            flex: 1,
            display: "flex", 
            backgroundColor: '#fff',
            alignItems: 'left',
            justifyContent: 'left',
            borderRadius: 10,
            borderColor: '#00ADB5',
            borderWidth: 1, 
            margin: 10,
            marginBottom: 10,
            shadowColor: '#171717',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
        },
        Titulo:{
            fontSize: 15,
            fontWeight: 'bold',
            marginTop: 5,
            marginLeft: 5,
            width: '100%',
            textAlign: 'left',
    
        },
        Descripcion:{
            fontSize: 15,
            marginBottom: 10,
            marginLeft: 5,
            width: '100%',
            textAlign: 'left',
        },
    
        // Foto
        Foto:{
            width: '100%',
            height: 200,
            borderColor: '#00ADB5',
            marginBottom: 5,
        },  
        imagen: {
            // border radius on top
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            width: '100%',
            height: '100%',
        },
    
        //Iconos
        Icons:{
            width: "20px",
            height:"20px",
    
        },
        icons:{
            flexDirection: 'row', 
            width: "100%",
            justifyContent: "left",
            margin: 5,
        },
        likes:{
            flexDirection: "row",
        },
        // Botones
        button:{
            width: "20px",
            height: "20px",
            alignItems: "center",
            justifyContent: "center",
            margin: 5,
            flexDirection: "row",
    
        },
        buttonDelete:{
            
            alignItems: "center",
            justifyContent: "center",
            margin: 5,
            flexDirection: "row",
            backgroundColor: '#00ADB5',
        },
    
        
        buttonText:{
            color: '#ffffff',
            fontSize: 15,
        },
        closeButton:{
            fontWeight: 'bold',
            color: '#ffffff',
            fontSize: 20,
            alignSelf: 'flex-end',
            padding: 10,
            backgroundColor: '#dc3545',
            marginTop:2,
            borderRadius: 10,
        },
        input:{
            width:'100%',  
            flex: 3,
            alignSelf: 'center',
            backgroundColor: "white",
            borderColor: 'rgba(0, 0, 0, 0.500)',
            borderWidth: 1,
            borderRadius: 6,
            padding: 10,
        },
        // Modal
        modalText:{
            fontWeight: 'bold',
            color: '#Black'
        },
        modalContainer:{
            width:'100%',
            borderRadius:4,
            padding:5,
            backgroundColor: '#fff',
            alignSelf: 'center',
            marginTop: 20,
            marginBottom: 10,
            shadowColor: '#171717',
            shadowOpacity: 1.2,
            shadowRadius: 3,
            borderWidth: 1,
            borderColor: '#fff',
        },
        modalText:{
            color: '#ffffff'
        },
        buttonModal:{
            alignSelf: 'center',
            backgroundColor: '#00ADB5',
            borderRadius: 4,
            padding: 10,
            marginTop: 10,
        }
    })
    
    export default Posteos;