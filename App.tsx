import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from "./screens/home";
import Login from "./screens/login";
import SignUp from "./screens/signup";
import ShopDetails from "./screens/shop";

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const [isLogged, setIsLogged] = React.useState(false);

  React.useEffect(() => {
    const fetchUser = async () => {
      const userToken = await AsyncStorage.getItem("token");
      if (userToken) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLogged ? (
          <>
            <Stack.Screen
              name="root"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Shop"
              component={ShopDetails}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
