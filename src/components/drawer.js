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
const Drawer = createDrawerNavigator()
export default class menu extends Component {
    constructor(){
        super()
        this.state={
            loggedIn: false,
            user: ''
        }
        //usamos la info del login de abajo
    }
    componentDidMount(){ //la funcion que se ejecuta cuando se carga el componente, apenas carga usa auth para preguntar si hay alguien loggeado, yo hago el mismo proceso de login
        auth.onAuthStateChanged(user => { //auth es de firebase, me ayuda a manejar todo de los usuarios
            if(user){
                this.setState({
                    loggedIn:true,
                    user: user,
                })
            }
        })
    }

    register(email, pass){
        auth.createUserWithEmailAndPassword(email, pass) //recibe dos datos, mail y contra, lo tenemos aca pq toda nuestra pagina tiene que saber si el usuario esta registrado o no, por eso usamos los params
            .then( ()=>{
                console.log('Registrado');
            })
            .catch( error => {
                console.log(error);
            })
    }
    login(email,pass){
        auth.signInWithEmailAndPassword(email,pass) //funciona parecido, nos devuelve los datos del usuario que se loggeo
            .then( response => { //response es lo que me trae, desp guardo la info en user
                this.setState({
                    loggedIn: true,
                    user:response.user,
                })
            })
            .catch(e => console.log(e))
    }

    logout(){
        auth.signOut() //olvidate que esta loggeado el usuario
            .then( (res)=>{
                this.setState({
                    user:'',
                    loggedIn: false,
                })
            })
            .catch()
    }
    // atentis a esto lo tomamos de lo de ale
    //Un drawer para cada página, trae cada una de las pantallas, el Navigator es la caja grande con todas las pantallas. 
    render() {
        return (
            <NavigationContainer> 
                {/* cuando no es true loggin, me muestra solo register y login, sino me ingresa a la página  */}
                {this.state.loggedIn ? 
                ( <Drawer.Navigator>
                    <Drawer.Screen name="home" component= {()=><Home/>}/>
                    <Drawer.Screen name="newpost" component= {(drawerProps)=><Newpost drawerProps ={drawerProps}/>}/> 
                    <Drawer.Screen name="profile" component= {()=><Profile logout={(email, pass)=>this.logout(email, pass)}/>}/>
                </Drawer.Navigator>

                ):(
                    <Drawer.Navigator>
                    <Drawer.Screen name="register" component= {()=><Register register={(email, pass)=>this.register(email, pass)}/>}/>
                    <Drawer.Screen name="login" component= {()=><Login login={(email, pass)=>this.login(email, pass)}/>}/>
                </Drawer.Navigator>
                )}
                
            </NavigationContainer>
        )
    }
}
