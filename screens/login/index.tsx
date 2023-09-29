import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginInput } from "./types";

export default function Login() {
  const navigation: any = useNavigation();

  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  useEffect(() => {
    async function checkToken() {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        navigation.navigate("root");
      }
    }

    checkToken();
  }, []);

  const handleInputChange = (name: string, value: string): void => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const response = await fetch(
        "https://931f-195-250-77-66.ngrok-free.app/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();

        const userId = data.userId;
        const token = data.access_token;
        await AsyncStorage.setItem("userId", userId);
        await AsyncStorage.setItem("token", token);
        navigation.navigate("root");
      } else {
        console.log(await response.text());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => handleInputChange("email", text)}
        value={formData.email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => handleInputChange("password", text)}
        value={formData.password}
        secureTextEntry={true}
      />
      <Button title="Login" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 200,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
