import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'

export default class register extends Component {
    constructor(props){
        super(props)
        this.state={
            email:'',
            userName:'',
            password:''
        }
    }
    render() {
        return (
            <View >
                <Text>Register</Text>
                <TextInput
                  
                    onChangeText={(text)=>this.setState({email: text})}
                    placeholder='email'
                    keyboardType='email-address'/>
                <TextInput
                   
                    onChangeText={(text)=>this.setState({userName: text})}
                    placeholder='user name'
                    keyboardType='default'/>
                <TextInput
                   
                    onChangeText={(text)=>this.setState({password: text})}
                    placeholder='password'
                    keyboardType='email-address'
                    secureTextEntry={true}
                />
                <TouchableOpacity  onPress={()=>this.props.register(this.state.email, this.state.password)} >
                    <Text >Registrarse</Text>    
                </TouchableOpacity>
            </View>
        )
    }
}