import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator} from '@react-navigation/drawer';
import Home from '../screens/home'
import Register from '../screens/register'
import {auth} from '../firebase/config'
const Drawer = createDrawerNavigator()
export default class menu extends Component {
    constructor(){
        super()
        this.state={}
    }
    componentDidMount(){
        auth.onAuthStateChanged(user => {
            if(user){
                this.setState({
                    loggedIn:true,
                    user: user,
                })
            }
        })
    }

    register(email, pass){
        auth.createUserWithEmailAndPassword(email, pass)
            .then( ()=>{
                console.log('Registrado');
            })
            .catch( error => {
                console.log(error);
            })
    }
    login(email,pass){
        auth.signInWithEmailAndPassword(email,pass)
            .then( response => {
                this.setState({
                    loggedIn: true,
                    user:response.user,
                })
            })
            .catch(e => console.log(e))
    }

    logout(){
        auth.signOut()
            .then( (res)=>{
                this.setState({
                    user:'',
                    loggedIn: false,
                })
            })
            .catch()
    }
    // atentis a esto lo tomamos de lo de ale
    render() {
        return (
            <NavigationContainer> 
                <Drawer.Navigator>
                    <Drawer.Screen name="home" component= {()=><Home/>}/>
                    <Drawer.Screen name="register" component= {()=><Register register={(email, pass)=>this.register(email, pass)}/>}/>



                </Drawer.Navigator>
            </NavigationContainer>
        )
    }
}
