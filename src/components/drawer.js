import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator} from '@react-navigation/drawer';
import Home from '../screens/home'
import Register from '../screens/register'
import Login from '../screens/login'
import Newpost from '../screens/newpost'
import Profile from '../screens/profile'
import {auth} from '../firebase/config'
import Buscador from '../screens/buscador'
const Drawer = createDrawerNavigator()
export default class menu extends Component {
    constructor(){
        super()
        this.state={
            loggedIn: false,
            user: '',
            error:''
        }
        //usamos la info del login de abajo
    }
    componentDidMount(){ //la funcion que se ejecuta cuando se carga el componente (se refreshea la pagina), apenas carga usa auth para preguntar si hay alguien loggeado, yo hago el mismo proceso de login
        auth.onAuthStateChanged(user => { 
            if(user){
                this.setState({
                    loggedIn:true,
                    user: user, 
                })
            }
        })
    }

    register(email, pass, user){
        auth.createUserWithEmailAndPassword(email, pass) //recibe dos datos, mail y contra, lo tenemos aca pq toda nuestra pagina tiene que saber si el usuario esta registrado o no, por eso usamos los params
            .then( ()=>{
                auth.currentUser.updateProfile({
                    displayName:user 
                })
                console.log('Registrado');
            })
            .catch( e => {this.setState ({
                error:e.message 
                // capturo los errores
            })
               
            })
    }
    login(email,pass){
        auth.signInWithEmailAndPassword(email,pass) //funciona parecido, nos devuelve los datos del usuario que se loggeo
            .then( response => { //response es lo que me trae, desp guardo la info en user
                this.setState({
                    loggedIn: true,
                    user:response.user, //guarda los datos del usuario que esta loggeado
                })
            })
            .catch(e => this.setState ({
                error:e.message 
                // capturo los errores
            }))
    }

    logout(){
        auth.signOut() //olvidate que esta loggeado el usuario, vacia la info y volve al comienzo
            .then( (res)=>{
                this.setState({
                    user:'',
                    loggedIn: false,
                })
            })
            .catch()
    }
    
    //Un drawer para cada p??gina, trae cada una de las pantallas, el Navigator es la caja grande con todas las pantallas. 
    render() {
        return (
            <NavigationContainer> 
                {/* cuando no es true loggin, me muestra solo register y login, sino me ingresa a la p??gina  */}
                {this.state.loggedIn ? 
                ( <Drawer.Navigator>
                    <Drawer.Screen name="HOME" component= {()=><Home/>}/>
                    <Drawer.Screen name="NEW POST" component= {(drawerProps)=><Newpost drawerProps ={drawerProps}/>}/> 
                    <Drawer.Screen name="MI PERFIL" component= {()=><Profile user={this.state.user}logout={(email, pass)=>this.logout(email, pass)}/>}/>
                    <Drawer.Screen name="BUSCAR" component= {()=><Buscador/>}/>
                </Drawer.Navigator>

                ):(
                    <Drawer.Navigator>
                    <Drawer.Screen name="REGISTRARME" component= {()=><Register register={(email, pass, user)=>this.register(email, pass, user)}/>}/>
                    <Drawer.Screen name="LOG IN" component= {()=><Login error ={this.state.error} login={(email, pass)=>this.login(email, pass)}/>}/>
                </Drawer.Navigator>
                )}
                
            </NavigationContainer>
        )
    }
}
