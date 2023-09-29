import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserData } from "../../screens/home/types";

export default function Header({
  handleClose,
  handleCloseItemModal,
  isItemPage,
}: any): JSX.Element {
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    const fetchUserInfo = async (): Promise<void> => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");

        if (userId && token) {
          const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          };

          const requestOptions = {
            method: "GET",
            headers: headers,
          };

          const res = await fetch(
            `https://931f-195-250-77-66.ngrok-free.app/users/me`,
            requestOptions
          );

          if (res.ok) {
            const data = await res.json();
            const response = await fetch(
              `https://931f-195-250-77-66.ngrok-free.app/users/${data.sub}`
            );
            const profileData = await response.json();
            setUser(profileData);
          } else {
            console.error("Failed to fetch user info");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <>
      {!isItemPage && (
        <View style={styles.container}>
          <View>
            <Text>Welcome, {user?.fullName}</Text>
          </View>
          <TouchableOpacity onPress={() => handleCloseItemModal()}>
            <Text>Add Shop Item</Text>
          </TouchableOpacity>
        </View>
      )}
      {isItemPage && (
        <View style={styles.container}>
          <Text>{user?.fullName}s cabinet</Text>
          {user?.role === "owner" && (
            <TouchableOpacity onPress={() => handleClose()}>
              <Text>Add Shop</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightgreen",
    width: "100%",
    height: 100,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
