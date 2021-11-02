import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class Home extends Component {
    constructor(){
        super()
        this.state={}
    }
    render() {
        return (
            <View>
                <Text> Hola Mundo </Text>
            </View>
        )
    }
}
