import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'

export default class login extends Component {
    constructor(props){
        super(props)
        this.state={
            email:'',
            password:''
        }
    }
    render() {
        return (
            <View >
                <Text>Login</Text>
                <TextInput
                    onChangeText={(text)=>this.setState({email: text})}
                    placeholder='email'
                    keyboardType='email-address'/>
                <TextInput
                    onChangeText={(text)=>this.setState({password: text})}
                    placeholder='password'
                    keyboardType='email-address'
                    secureTextEntry={true}
                />
                <TouchableOpacity disabled={this.state.email==''|| this.state.password==''? true:false}onPress={()=>this.props.login(this.state.email, this.state.password)}>
                <Text >Ingresar</Text>    
                    
                </TouchableOpacity>

                <Text >{this.props.error}</Text>  
                
            </View>
        )
    }
}
