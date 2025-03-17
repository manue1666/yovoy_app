import React from 'react';
import {Alert, Button, Text, TouchableHighlight, View} from 'react-native';

//prueba de componentes
const OlaPeruano = () => {
  return (
    <View>
        <TouchableHighlight onPress={()=> alert("coñoooo")} style={{backgroundColor:"red",width:100,height:30 , borderRadius:100}}>
            <Text style={{color:"white",flexWrap:"wrap"}}>peruanizador</Text>
        </TouchableHighlight>
      
    </View>
  );
};
export default OlaPeruano; 