import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator} from '@react-navigation/drawer';
import Home from '../screens/home'
import Register from '../screens/register'

const Drawer = createDrawerNavigator()
export default class menu extends Component {
    constructor(){
        super()
        this.state={}
    }
    render() {
        return (
            <NavigationContainer> 
                <Drawer.Navigator>
                    <Drawer.Screen name="home" component= {()=><Home/>}/>
                    <Drawer.Screen name="register" component= {()=><Register/>}/>


                    
                </Drawer.Navigator>
            </NavigationContainer>
        )
    }
}
