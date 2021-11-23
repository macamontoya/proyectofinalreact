import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native'
import Posteos from '../components/post'
import {db} from '../firebase/config'

export default class login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            input: '',
            post: null, //posts puede tomar tres valores: nulo, lista vacia o posteo

        }
    }
    buscar() {
        db.collection('posts').orderBy('createdAt', 'desc').where('owner', '==', this.state.input).onSnapshot (docs => {  //documentos que trae onSnapshots //snapshot comentario te trae apenas lo pedis los post donde el dueno es el email del usuario
                let posts = []; //le agrego un objeto donde guardo el id y la data seteamos a post vacio
                docs.forEach(doc => {
                    posts.push({
                        id: doc.id, //le da su id
                        data: doc.data() //la info del post guardala en data
                    })
                })
                console.log("llegue aca")
                this.setState({
                    post: posts, //marcamos adentro los posts
                    input: ''
                })
            })
    }
    render() {
        return (
            <View >
                <Text>Busca un posteo!</Text>
                <TextInput
                    onChangeText={(text) => this.setState({ input: text })}
                    placeholder='buscar'
                    keyboardType='default'
                    value={this.state.input} />
                {/* RESETEA EL VALOR del input, el buscador no queda con letras  */}
                <TouchableOpacity disabled={this.state.input == '' ? true : false} onPress={() => this.buscar()}>
                    <Text >Buscar</Text>

                </TouchableOpacity>

                <Text >{this.props.error}</Text>
                {this.state.post ?
                    this.state.post.length > 0 ? //hay algun elemento adentro de la lista?
                        <FlatList
                            data={this.state.post} //agarra una lista que se guarda en data
                            keyExtractor={item => item.id.toString()} //siempre necesito el id, pasame el numero de id a letra 
                renderItem={({ item }) => <Posteos data={item} /> } />// a cada conmponente le mando la data de un posteo 
                 :
                        <Text> No hay resultados para su búsqueda</Text>
                    :
                    <Text></Text>

                }
            </View>
        )
    }
}
