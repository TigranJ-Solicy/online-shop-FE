import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/header";
import { ShopData } from "../shop/types";
import { ShopInput, UserData } from "./types";

export default function Home(): JSX.Element {
  const navigation: any = useNavigation();

  const [open, setOpen] = useState<boolean>(false);
  const [updated, setUpdated] = useState<boolean>(false);
  const [shops, setShops] = useState<Array<ShopData>>();
  const [user, setUser] = useState<UserData>();
  const [users, setUsers] = useState<Array<UserData>>();
  const [formData, setFormData] = useState<ShopInput>({
    title: "",
    owner: "",
    image: "",
  });

  const fetchUserInfo = async (): Promise<void> => {
    const token = await AsyncStorage.getItem("token");
    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserShops = async (): Promise<void> => {
    const userId = await AsyncStorage.getItem("userId");
    try {
      const res = await fetch(
        `https://931f-195-250-77-66.ngrok-free.app/shops/user/${userId}`
      );
      const data = await res.json();
      setShops(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async (): Promise<void> => {
    try {
      const res = await fetch(
        `https://931f-195-250-77-66.ngrok-free.app/users`
      );
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (name: string, value: string): void => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      formData.owner = user?._id;

      const response = await fetch(
        "https://931f-195-250-77-66.ngrok-free.app/shops",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setUpdated(!updated);
        handleClose();
      } else {
        console.log(await response.text());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    try {
      const response = await fetch(
        `https://931f-195-250-77-66.ngrok-free.app/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setUpdated(!updated);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteShop = async (shopId: string): Promise<void> => {
    try {
      const response = await fetch(
        `https://931f-195-250-77-66.ngrok-free.app/shops/${shopId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setUpdated(!updated);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchUserShops();
    fetchUser();
  }, [updated]);

  const handleClose = (): void => {
    setOpen(!open);
  };

  const navigateToCollectionDetails = useCallback(
    (item: ShopData) => {
      navigation.navigate("Shop", { id: item._id });
    },
    [navigation]
  );

  return (
    <SafeAreaView>
      <Header handleClose={handleClose} isItemPage />
      <View style={styles.userInfoContainer}>
        <Text>Username: {user?.fullName}</Text>
        <Text>Email: {user?.email}</Text>
        <Text>Role: {user?.role}</Text>
      </View>
      {user?.role === "owner" && (
        <>
          <ScrollView style={styles.shopsContainer}>
            {shops?.map((item: any, index: number) => (
              <TouchableOpacity key={index} style={styles.shopItem}>
                <TouchableOpacity
                  onPress={() => handleDeleteShop(item._id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>X</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigateToCollectionDetails(item);
                  }}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.shopImage}
                  />
                  <Text style={styles.shopTitle}>{item.title}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <SafeAreaView>
            <Modal visible={open} animationType="slide" transparent={true}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <ScrollView>
                    <Text>Add Shop</Text>
                    <TextInput
                      placeholder="Title"
                      value={formData.title}
                      onChangeText={(text) => handleInputChange("title", text)}
                      style={styles.input}
                    />
                    <TextInput
                      placeholder="Image URL"
                      value={formData.image}
                      onChangeText={(text) => handleInputChange("image", text)}
                      style={styles.input}
                    />
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={styles.addButton}
                    >
                      <Text style={styles.addButtonText}>Add Shop</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleClose}
                      style={styles.closeButton}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </SafeAreaView>
        </>
      )}
      {user?.role === "admin" && (
        <ScrollView style={styles.usersContainer}>
          {users?.map((item: any, index: number) => (
            <View key={index} style={styles.userItem}>
              <TouchableOpacity
                onPress={() => handleDeleteUser(item._id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
              <View style={styles.userInfo}>
                <Text>Email: {item.email}</Text>
                <Text>Full Name: {item.fullName}</Text>
                <Text>Role: {item.role}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userInfoContainer: {
    padding: 20,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  shopsContainer: {
    height: "100%",
  },
  shopItem: {
    borderWidth: 1,
    borderColor: "black",
    margin: 10,
  },
  deleteButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    zIndex: 1,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  shopImage: {
    width: "100%",
    height: 200,
  },
  shopTitle: {
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    position: "absolute",
    width: 400,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    margin: 10,
  },
  addButton: {
    backgroundColor: "blue",
    padding: 10,
    margin: 10,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    margin: 10,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
  usersContainer: {
    marginTop: 20,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    margin: 10,
    position: "relative",
  },
  userInfo: {
    padding: 10,
  },
});
