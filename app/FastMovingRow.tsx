import React, { Component } from 'react'
import { ScrollView, Text, View, StyleSheet, Image } from 'react-native'

export default class FastMovingRow extends Component {
    render() {
        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.scrollRow}>
                    <View style= {styles.singleFoodContainer}>
                        <Text style={styles.foodTitle}>Karuppukavini Rice</Text>
                        <Image style={{}} source={require("./Components/Images/karupukavuni.png")}/>
                    </View>
                    <View style= {styles.singleFoodContainer}>
                        <Text style={styles.foodTitle}>Groundnut Oil</Text>
                        <Image source={require("./Components/Images/grounnutoil.png")}/>
                    </View>
                    <View style= {styles.singleFoodContainer}>
                        <Text style={styles.foodTitle}>White Rice</Text>
                        <Image source={require("./Components/Images/wrice.png")}/>
                    </View>
                    <View style= {styles.singleFoodContainer}>
                        <Text style={styles.foodTitle}>Brown Rice</Text>
                        <Image source={require("./Components/Images/brice.png")}/>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
  singleFoodContainer: {
    padding: 20,
    marginHorizontal: 15
  },
  scrollRow: {
    flexDirection: "row"
  },
  scrollImages: {
    alignContent: "center",
    alignItems: "center"
  },
  foodTitle:{
    fontWeight: "bold",
    paddingBottom: 10
  }
})
