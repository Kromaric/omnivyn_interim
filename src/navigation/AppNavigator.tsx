import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/AuthContext';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Main Screens
import DashboardScreen from '../screens/DashboardScreen';
import MissionsScreen from '../screens/MissionsScreen';
import MissionDetailScreen from '../screens/MissionDetailScreen';
import MyMissionsScreen from '../screens/MyMissionsScreen';
import ContratsScreen from '../screens/ContratsScreen';
import SignatureScreen from '../screens/SignatureScreen';
import PaiementsScreen from '../screens/PaiementsScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack pour l'authentification
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ headerShown: true, title: 'Inscription' }}
      />
    </Stack.Navigator>
  );
}

// Stack pour les missions
function MissionsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MissionsList" 
        component={MissionsScreen}
        options={{ title: 'Missions disponibles' }}
      />
      <Stack.Screen 
        name="MissionDetail" 
        component={MissionDetailScreen}
        options={{ title: 'Détails de la mission' }}
      />
    </Stack.Navigator>
  );
}

// Stack pour mes missions
function MyMissionsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MyMissionsList" 
        component={MyMissionsScreen}
        options={{ title: 'Mes missions' }}
      />
    </Stack.Navigator>
  );
}

// Stack pour les contrats
function ContratsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ContratsList" 
        component={ContratsScreen}
        options={{ title: 'Mes contrats' }}
      />
      <Stack.Screen 
        name="Signature" 
        component={SignatureScreen}
        options={{ title: 'Signature du contrat' }}
      />
    </Stack.Navigator>
  );
}

// Stack pour le profil
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ title: 'Mon profil' }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ title: 'Modifier mon profil' }}
      />
      <Stack.Screen 
        name="Documents" 
        component={DocumentsScreen}
        options={{ title: 'Mes documents' }}
      />
    </Stack.Navigator>
  );
}

// Tabs principales
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'view-dashboard';

          if (route.name === 'Dashboard') {
            iconName = 'view-dashboard';
          } else if (route.name === 'Missions') {
            iconName = 'briefcase-search';
          } else if (route.name === 'MyMissions') {
            iconName = 'briefcase-check';
          } else if (route.name === 'Contrats') {
            iconName = 'file-document';
          } else if (route.name === 'Profile') {
            iconName = 'account';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ 
          title: 'Accueil',
          headerShown: true,
          headerTitle: 'Tableau de bord'
        }}
      />
      <Tab.Screen 
        name="Missions" 
        component={MissionsStack}
        options={{ 
          title: 'Missions',
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="MyMissions" 
        component={MyMissionsStack}
        options={{ 
          title: 'Mes missions',
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Contrats" 
        component={ContratsStack}
        options={{ 
          title: 'Contrats',
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ 
          title: 'Profil',
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
}

// Navigation principale
export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
