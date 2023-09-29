import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "../../components/header";
import { ShopData, ShopInput } from "./types";

function ShopDetails(): JSX.Element {
  const route = useRoute();
  const [open, setOpen] = useState<boolean>(false);
  const [updated, setUpdated] = useState<boolean>(false);
  const [shop, setShop] = useState<ShopData>();
  const [formData, setFormData] = useState<ShopInput>({
    name: "",
    image: "",
    price: "",
  });

  const routerParams = route?.params as any;
  const shopId = routerParams.id;

  const handleCloseItemModal = (): void => {
    setOpen(!open);
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const response = await fetch(
        `https://931f-195-250-77-66.ngrok-free.app/shops/${shopId}/shop-items`,
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
        setOpen(!open);
      } else {
        console.log(await response.text());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getShop = async (): Promise<void> => {
    try {
      const res = await fetch(
        `https://931f-195-250-77-66.ngrok-free.app/shops/${shopId}`
      );
      const data = await res.json();
      setShop(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getShop();
  }, [updated]);

  const handleInputChange = (name: string, value: string): void => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDeleteShopItem = async (
    shopId: string,
    itemId: string
  ): Promise<void> => {
    try {
      const response = await fetch(
        `https://931f-195-250-77-66.ngrok-free.app/shops/${shopId}/shop-items/${itemId}`,
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

  return (
    <SafeAreaView>
      <Header isItemPage={false} handleCloseItemModal={handleCloseItemModal} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={open}
        onRequestClose={() => {
          handleCloseItemModal;
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Add Shop Item</Text>
            <TextInput
              placeholder="Name"
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Image URL"
              value={formData.image}
              onChangeText={(text) => handleInputChange("image", text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Price"
              value={formData.price}
              onChangeText={(text) => handleInputChange("price", text)}
              style={styles.input}
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Shop Item</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCloseItemModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {shop?.shopItems?.length ? (
        <View style={styles.shopItemsContainer}>
          {shop?.shopItems?.map((item, index) => (
            <View key={index} style={styles.shopItem}>
              <TouchableOpacity
                onPress={() => handleDeleteShopItem(shop._id, item._id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
              <View style={styles.shopItemInfo}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.shopItemImage}
                />
                <Text>Name: {item.name}</Text>
                <Text>Price: {item.price}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noItemText}>No items to show</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: "blue",
    padding: 10,
    marginVertical: 10,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
  shopItemsContainer: {
    padding: 20,
  },
  shopItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    marginVertical: 10,
    position: "relative",
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
  shopItemInfo: {
    padding: 10,
  },
  shopItemImage: {
    width: 200,
    height: 200,
  },
  noItemText: {
    textAlign: "center",
  },
});

export default ShopDetails;
