import { Image, StyleSheet, Platform, View, Text, Pressable, TextInput, TouchableOpacity, Alert, Vibration, Modal, ScrollView, } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from 'react';
import firebase from '@/db/firebase';
export default function HomeScreen() {
  const [image, setImage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [foodPrice, setFoodPrice] = useState("");
  let title = "";
  const [downloadUrl, setDownloadUrl] = useState("");
  const [foodName, setfoodName] = useState("");
  const [foodDescription, setfoodDescription] = useState("");
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const source = { uri: result.assets[0].uri }
      setImage(source);
    }
  };
  const colorScheme = useColorScheme();
  const upload = async () => {
    // upload image here

    if (image !== '' && foodPrice !== '' && foodName !== '' && foodDescription !== '') {
      const uploadImage = async (uri) => {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${Date.now()}.jpg`);

        const response = await fetch(uri);
        const blob = await response.blob();

        await uploadBytes(storageRef, blob);
        const imageUrl = await getDownloadURL(storageRef);
        setDownloadUrl(imageUrl);
        return imageUrl;
      };
      uploadImage(image.uri);
      firebase.firestore().collection('foods').add({
        foodName: foodName,
        foodDescription: foodDescription,
        foodPrice: foodPrice,
        image: downloadUrl,
      }).then(() => {
        console.log("Successfully added");
        setOpenModal(true);
        setFoodPrice('');
        setfoodName('');
        setImage('');
        setfoodDescription('');
        Vibration.vibrate(100);
      }).catch((e) => {

        console.log("Failed to add", e);
        Alert.alert("Failed to add");
        Vibration.vibrate(100);
      })
    } else {
      Alert.alert("Please fill all the fields");
    }
  }
  return (
    <ScrollView style={styles.container}>
      {/* <Link push href={"/login"}>
        <Text style={{
          color: "#fff",
        }}>Login</Text>
      </Link> */}
      <View style={{
        marginTop: 50,
      }}>
        <Modal
          visible={openModal}
          statusBarTranslucent={true}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.content}>
            <View style={styles.card}>
              <Text style={styles.title}>Data Added!!</Text>
              <Text style={styles.desc}>
                {foodName}{foodPrice}{foodDescription}
              </Text>
              <View>
                {/* <TextInput style={{
                  borderWidth: 1,
                  borderColor: '#000',
                  padding: 15,
                  borderRadius: 8,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
                  value={loc}
                /> */}
                {/* <Text>
                    {
                      locations.mocked
                    }
                  </Text> */}

              </View>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    width: "100%",
                    marginTop: 10,
                    backgroundColor: "rgba(0,0,0,0.1)",
                  },
                ]}
                onPress={() => setOpenModal(false)}
              >
                <Text style={[styles.text, { color: "black" }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TextInput style={{
          borderWidth: 2,
          borderColor: colorScheme === 'dark' ? "#fff" : "black",
          padding: 14,
          borderRadius: 10,
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 10,
          color: "#FFF",
        }}
          onChangeText={setfoodName} value={foodName} placeholderTextColor={`${colorScheme === 'dark' ? "white" : "black"
            }`} placeholder='Food Name' />
        <TextInput style={{
          borderWidth: 2,
          borderColor: colorScheme === 'dark' ? "#fff" : "black",
          padding: 14,
          borderRadius: 10,
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 10,
          color: "#FFF",
        }} placeholderTextColor={`${colorScheme === 'dark' ? "white" : "black"
          }`} onChangeText={setFoodPrice} keyboardType='number-pad' value={foodPrice} placeholder='Food Price' />
        <TextInput style={{
          borderWidth: 2,
          borderColor: colorScheme === 'dark' ? "#fff" : "black",
          padding: 14,
          marginTop: 10,
          borderRadius: 10,
          fontSize: 20,
          fontWeight: "bold",
          paddingBottom: 90,
          color: "#FFF",
        }} placeholderTextColor={`${colorScheme === 'dark' ? "white" : "black"
          }`} onChangeText={setfoodDescription} value={foodDescription} placeholder='Food Description' />
      </View>
      <View>
        {image && (
          <Image source={{
            uri: image.uri,
          }}
            style={{
              width: "auto",
              marginTop: 20,
              height: 250,
              borderRadius: 25,
              objectFit: "cover",
            }}
          />
        )
        }
      </View>
      <Pressable onPress={pickImage} style={{
        marginTop: 20, backgroundColor: colorScheme === 'dark' ? "#fff" : "#000", padding: 20,
        borderRadius: 10,
        alignItems: "center",
      }}>
        <Text style={{
          fontSize: 20,
          fontWeight: "bold",
          color: colorScheme === 'dark' ? "#000" : "#fff",
        }}>Pick an image from camera roll</Text>
      </Pressable>
      <Pressable onPress={upload} style={{
        marginTop: 20, borderColor: colorScheme === 'dark' ? "#fff" : "#000", padding: 15,
        borderWidth: 1,
        marginBottom:40,
        borderRadius: 10,
        alignItems: "center",
      }}>
        <Text style={{
          fontSize: 20,
          fontWeight: "bold",
          color: colorScheme === 'dark' ? "#fff" : "#000",
        }}>UPLOAD</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop:20,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  desc: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.7,
    color: "#000",
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 12,
  },
  card: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  text: {
    fontWeight: "600",
    fontSize: 16,
    color: "white",
  },
  button: {
    width: "90%",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    borderRadius: 8,
  },
});
