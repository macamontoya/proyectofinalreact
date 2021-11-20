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
                  
                //   cuando se modifica el campo de texto, guardo lo escrito en el estado X3

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
                <TouchableOpacity disabled={this.state.email==''|| this.state.password==''|| this.state.userName==''? true:false} onPress={()=>this.props.register(this.state.email, this.state.password, this.state.userName)} >
                  {/* ? = mi condicion (if ternario = no solamente cumple la condicion sino que devuelve algo) si se cumple la condicion devolve true, sino false */}
                    <Text >Registrarse</Text> 

                </TouchableOpacity>
                
                <Text >{this.props.error}</Text>  
            </View>
        )
    }
}