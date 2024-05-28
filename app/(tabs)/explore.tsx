import firebase from '@/db/firebase';
import { StyleSheet, Image, Platform, View, Text, useColorScheme, TouchableOpacity } from 'react-native';


export default function TabTwoScreen() {
  const schemaColor = useColorScheme();
  let sm;
  const management = async (mng) => {
    // check management
    let sm;
  
    if (mng === "off") {
      sm = false;
      console.log("Turning app off...");
    } else {
      sm = true;
      console.log("Turning app on...");
    }
  
    try {
      const docRef = firebase.firestore().collection("appmng").doc("MaqCz1bi2a8VLOhSyA51");
  
      // Update existing document
      await docRef.update({
        status: sm
      });
  
      console.log("App state updated successfully.");
    } catch (error) {
      console.error("Error updating app state:", error);
    }
  };
  
  return (
    <View style={{
      flex:1,
      padding:30,
      paddingTop:80
    }}>
      <Text style={{
        color:schemaColor === "light"? "#000":"#fff",
        fontSize:40,
        fontWeight:"bold"
      }}>
        Settings
      </Text>
      <View>
        <TouchableOpacity     onPress={() => {
       management("on");
         }} style={{
            marginTop: 20, backgroundColor: schemaColor === 'dark' ? "#fff" : "#000", padding: 20,
            borderRadius: 10,
            alignItems: "center",
        }}>
         <Text style={{
          fontSize:25,
          fontWeight:"bold",
          color:schemaColor === 'light'? "#fff" :"#000",
         }}> Application ON</Text>
        </TouchableOpacity>
        <TouchableOpacity 
         onPress={() => {
          management("off");
         }}
        style={{
           marginTop: 20, borderColor: schemaColor === 'dark' ? "#fff" : "#000", padding: 15,
           borderWidth: 1,
           marginBottom:40,
           borderRadius: 10,
           alignItems: "center",
        }}>
         <Text style={{
            fontSize: 20,
            fontWeight: "bold",
            color: schemaColor === 'dark' ? "#fff" : "#000",
         }}> Application Off</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
