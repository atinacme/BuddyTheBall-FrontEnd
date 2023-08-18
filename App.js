/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from "react-redux";
import store from "./store";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from "react-native";
import SignIn from './src/auth/SignIn.js';
import ForgotPassword from './src/auth/ForgotPassword';
import ResetPassword from './src/auth/ResetPassword';
import ParentDashboard from './src/parent/ParentDashboard';
import ParentPhotos from './src/parent/ParentPhotos.js';
import ParentParticularPhoto from './src/parent/ParentParticularPhoto.js';
import ParentMessages from './src/parent/ParentMessages';
import ParentMessageCreation from './src/parent/ParentMessageCreation';
import ParentParticularMessage from './src/parent/ParentParticularMessage';
import CoachDashboard from './src/coach/CoachDashboard.js';
import CoachParents from './src/coach/CoachParents';
import CoachParentCreation from './src/coach/CoachParentCreation';
import CoachParentDescription from './src/coach/CoachParentDescription';
import CoachSchoolsPhotos from './src/coach/CoachSchoolsPhotos.js';
import CoachPhotoCreation from './src/coach/CoachPhotoCreation.js';
import CoachParticularSchoolPhotos from './src/coach/CoachParticularSchoolPhotos.js';
import CoachSessions from './src/coach/CoachSessions';
import CoachSessionCreation from './src/coach/CoachSessionCreation';
import CoachSessionDescription from './src/coach/CoachSessionDescription';
import CoachClasses from './src/coach/CoachClasses';
import CoachClassCreation from './src/coach/CoachClassCreation';
import CoachClassDescription from './src/coach/CoachClassDescription';
import CoachCalendar from './src/coach/CoachCalendar.js';
import CoachMessages from './src/coach/CoachMessages.js';
import CoachMessageCreation from './src/coach/CoachMessageCreation';
import CoachParticularMessage from './src/coach/CoachParticularMessage';
import CoachSchoolList from './src/coach/CoachSchoolList.js';
import CoachParticularSchoolStudents from './src/coach/CoachParticularSchoolStudents.js';
import SuperAdminDashboard from './src/superadmin/SuperAdminDashboard.js';
import SuperAdminBilling from './src/superadmin/SuperAdminBilling.js';
import SuperAdminBillingCoachSchool from './src/superadmin/SuperAdminBillingCoachSchool';
import SuperAdminInvoiceCoachSchool from './src/superadmin/SuperAdminInvoiceCoachSchool';
import SuperAdminCoaches from './src/superadmin/SuperAdminCoaches.js';
import SuperAdminCoachCreation from './src/superadmin/SuperAdminCoachCreation';
import SuperAdminCoachDescription from './src/superadmin/SuperAdminCoachDescription';
import SuperAdminSchools from './src/superadmin/SuperAdminSchools.js';
import SuperAdminSchoolDescription from './src/superadmin/SuperAdminSchoolDescription.js';
import SuperAdminSchoolCreation from './src/superadmin/SuperAdminSchoolCreation.js';
import SuperAdminPhotos from './src/superadmin/SuperAdminPhotos.js';
import SuperAdminParticularSchoolPhotos from './src/superadmin/SuperAdminParticularSchoolPhotos';
import SuperAdminParticularPhoto from './src/superadmin/SuperAdminParticularPhoto';
import SuperAdminParents from './src/superadmin/SuperAdminParents';
import SuperAdminParentCreation from './src/superadmin/SuperAdminParentCreation';
import SuperAdminParentDescription from './src/superadmin/SuperAdminParentDescription';
import SuperAdminSettings from './src/superadmin/SuperAdminSettings.js';
import SuperAdminMessages from './src/superadmin/SuperAdminMessages';
import SuperAdminCalendar from './src/superadmin/SuperAdminCalendar';
import SuperAdminMessageCreation from './src/superadmin/SuperAdminMessageCreation';
import SuperAdminParticularMessage from './src/superadmin/SuperAdminParticularMessage';
import SuperAdminRegionalManagers from './src/superadmin/SuperAdminRegionalManagers';
import SuperAdminRegionalManagerDescription from './src/superadmin/SuperAdminRegionalManagerDescription';
import SuperAdminRegionalManagerCreation from './src/superadmin/SuperAdminRegionalManagerCreation';
import SuperAdminRegions from './src/superadmin/SuperAdminRegions';
import SuperAdminRegionCreation from './src/superadmin/SuperAdminRegionCreation';
import SuperAdminRegionDescription from './src/superadmin/SuperAdminRegionDescription';
import SuperAdminSessions from './src/superadmin/SuperAdminSessions';
import SuperAdminSessionCreation from './src/superadmin/SuperAdminSessionCreation';
import SuperAdminSessionDescription from './src/superadmin/SuperAdminSessionDescription';
import SuperAdminClasses from './src/superadmin/SuperAdminClasses';
import SuperAdminClassCreation from './src/superadmin/SuperAdminClassCreation';
import SuperAdminClassDescription from './src/superadmin/SuperAdminClassDescription';
import RegionalManagerDashboard from './src/regionalmanager/RegionalManagerDashboard';
import RegionalManagerParents from './src/regionalmanager/RegionalManagerParents';
import RegionalManagerParentCreation from './src/regionalmanager/RegionalManagerParentCreation';
import RegionalManagerParentDescription from './src/regionalmanager/RegionalManagerParentDescription';
import RegionalManagerCoaches from './src/regionalmanager/RegionalManagerCoaches';
import RegionalManagerCoachCreation from './src/regionalmanager/RegionalManagerCoachCreation';
import RegionalManagerCoachDescription from './src/regionalmanager/RegionalManagerCoachDescription.js';
import RegionalManagerPhotos from './src/regionalmanager/RegionalManagerPhotos';
import RegionalManagerParticularSchoolPhotos from './src/regionalmanager/RegionalManagerParticularSchoolPhotos';
import RegionalManagerCalendar from './src/regionalmanager/RegionalManagerCalendar';
import RegionalManagerCoachAgenda from './src/regionalmanager/RegionalManagerCoachAgenda';
import RegionalManagerSessions from './src/regionalmanager/RegionalManagerSessions';
import RegionalManagerSessionCreation from './src/regionalmanager/RegionalManagerSessionCreation';
import RegionalManagerSessionDescription from './src/regionalmanager/RegionalManagerSessionDescription';
import RegionalManagerClasses from './src/regionalmanager/RegionalManagerClasses';
import RegionalManagerClassCreation from './src/regionalmanager/RegionalManagerClassCreation';
import RegionalManagerClassDescription from './src/regionalmanager/RegionalManagerClassDescription';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <LinearGradient colors={['#BCD7EF', '#D1E3AA', '#E3EE68', '#E1DA00']} style={styles.linearGradient}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SignIn" screenOptions={{
            headerShown: true,
            headerTransparent: true,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 16,
              textTransform: 'uppercase',
            },
          }}>
            <Stack.Screen name="SignIn" component={SignIn} style={{ marginTop: 40 }} />
            <Stack.Screen name="Forgot Password" component={ForgotPassword} style={{ marginTop: 40 }} />
            <Stack.Screen name="Reset Password" component={ResetPassword} style={{ marginTop: 40 }} />
            <Stack.Screen name="Parent Dashboard" options={{ headerBackVisible: false, headerTitleAlign: 'center' }} component={ParentDashboard} />
            <Stack.Screen name="Parent Photos" component={ParentPhotos} />
            <Stack.Screen name="Parent Particular Photo" component={ParentParticularPhoto} />
            <Stack.Screen name="Parent Messages" component={ParentMessages} />
            <Stack.Screen name="Parent Message Creation" component={ParentMessageCreation} />
            <Stack.Screen name="Parent Particular Message" component={ParentParticularMessage} />
            <Stack.Screen name="Coach Dashboard" options={{ headerBackVisible: false, headerTitleAlign: 'center' }} component={CoachDashboard} />
            <Stack.Screen name="Coach Parents" component={CoachParents} />
            <Stack.Screen name="Coach Parent Creation" component={CoachParentCreation} />
            <Stack.Screen name="Coach Parent Description" component={CoachParentDescription} />
            <Stack.Screen name="Coach Schools Photos" component={CoachSchoolsPhotos} />
            <Stack.Screen name="Coach Photo Creation" component={CoachPhotoCreation} />
            <Stack.Screen name="Coach Particular School Photos" component={CoachParticularSchoolPhotos} />
            <Stack.Screen name="Coach Sessions" component={CoachSessions} />
            <Stack.Screen name="Coach Session Creation" component={CoachSessionCreation} />
            <Stack.Screen name="Coach Session Description" component={CoachSessionDescription} />
            <Stack.Screen name="Coach Classes" component={CoachClasses} />
            <Stack.Screen name="Coach Class Creation" component={CoachClassCreation} />
            <Stack.Screen name="Coach Class Description" component={CoachClassDescription} />
            <Stack.Screen name="Coach Calendar" component={CoachCalendar} />
            <Stack.Screen name="Coach Messages" component={CoachMessages} />
            <Stack.Screen name="Coach Message Creation" component={CoachMessageCreation} />
            <Stack.Screen name="Coach Particular Message" component={CoachParticularMessage} />
            <Stack.Screen name="Coach School List" component={CoachSchoolList} />
            <Stack.Screen name="Coach Particular School Students" component={CoachParticularSchoolStudents} />
            <Stack.Screen name="Super Admin Dashboard" options={{ headerTitleAlign: 'center' }} component={SuperAdminDashboard} />
            <Stack.Screen name="Super Admin Billing" component={SuperAdminBilling} />
            <Stack.Screen name="Super Admin Billing Coach School" component={SuperAdminBillingCoachSchool} />
            <Stack.Screen name="Super Admin Invoice Coach School" component={SuperAdminInvoiceCoachSchool} />
            <Stack.Screen name="Super Admin Coaches" component={SuperAdminCoaches} />
            <Stack.Screen name="Super Admin Coach Creation" component={SuperAdminCoachCreation} />
            <Stack.Screen name="SuperAdmin Coach Description" component={SuperAdminCoachDescription} />
            <Stack.Screen name="Super Admin Schools" component={SuperAdminSchools} />
            <Stack.Screen name="Super Admin School Description" component={SuperAdminSchoolDescription} />
            <Stack.Screen name="Super Admin School Creation" component={SuperAdminSchoolCreation} />
            <Stack.Screen name="Super Admin Photos" component={SuperAdminPhotos} />
            <Stack.Screen name="Super Admin Particular School Photos" component={SuperAdminParticularSchoolPhotos} />
            <Stack.Screen name="Super Admin Particular Photo" component={SuperAdminParticularPhoto} />
            <Stack.Screen name="Super Admin Parents" component={SuperAdminParents} />
            <Stack.Screen name="Super Admin Parent Creation" component={SuperAdminParentCreation} />
            <Stack.Screen name="Super Admin Parent Description" component={SuperAdminParentDescription} />
            <Stack.Screen name="Super Admin Settings" options={{ headerBackVisible: false, headerTitleAlign: 'center' }} component={SuperAdminSettings} />
            <Stack.Screen name="Super Admin Messages" component={SuperAdminMessages} />
            <Stack.Screen name="Super Admin Calendar" component={SuperAdminCalendar} />
            <Stack.Screen name="Super Admin Message Creation" component={SuperAdminMessageCreation} />
            <Stack.Screen name="Super Admin Particular Message" component={SuperAdminParticularMessage} />
            <Stack.Screen name="Super Admin Regional Manager" component={SuperAdminRegionalManagers} />
            <Stack.Screen name="Super Admin Regional Manager Description" component={SuperAdminRegionalManagerDescription} />
            <Stack.Screen name="Super Admin Regional Manager Creation" component={SuperAdminRegionalManagerCreation} />
            <Stack.Screen name="Super Admin Regions" component={SuperAdminRegions} />
            <Stack.Screen name="Super Admin Region Creation" component={SuperAdminRegionCreation} />
            <Stack.Screen name="Super Admin Region Description" component={SuperAdminRegionDescription} />
            <Stack.Screen name="Super Admin Sessions" component={SuperAdminSessions} />
            <Stack.Screen name="Super Admin Session Creation" component={SuperAdminSessionCreation} />
            <Stack.Screen name="Super Admin Session Description" component={SuperAdminSessionDescription} />
            <Stack.Screen name="Super Admin Classes" component={SuperAdminClasses} />
            <Stack.Screen name="Super Admin Class Creation" component={SuperAdminClassCreation} />
            <Stack.Screen name="Super Admin Class Description" component={SuperAdminClassDescription} />
            <Stack.Screen name="Regional Manager Dashboard" component={RegionalManagerDashboard} />
            <Stack.Screen name="Regional Manager Parents" component={RegionalManagerParents} />
            <Stack.Screen name="Regional Manager Parent Creation" component={RegionalManagerParentCreation} />
            <Stack.Screen name="Regional Manager Parent Description" component={RegionalManagerParentDescription} />
            <Stack.Screen name="Regional Manager Coaches" component={RegionalManagerCoaches} />
            <Stack.Screen name="Regional Manager Coach Creation" component={RegionalManagerCoachCreation} />
            <Stack.Screen name="Regional Manager Coach Description" component={RegionalManagerCoachDescription} />
            <Stack.Screen name="Regional Manager Photos" component={RegionalManagerPhotos} />
            <Stack.Screen name="Regional Manager Particular School Photos" component={RegionalManagerParticularSchoolPhotos} />
            <Stack.Screen name="Regional Manager Sessions" component={RegionalManagerSessions} />
            <Stack.Screen name="Regional Manager Session Creation" component={RegionalManagerSessionCreation} />
            <Stack.Screen name="Regional Manager Session Description" component={RegionalManagerSessionDescription} />
            <Stack.Screen name="Regional Manager Classes" component={RegionalManagerClasses} />
            <Stack.Screen name="Regional Manager Class Creation" component={RegionalManagerClassCreation} />
            <Stack.Screen name="Regional Manager Class Description" component={RegionalManagerClassDescription} />
            <Stack.Screen name="Regional Manager Calendar" component={RegionalManagerCalendar} />
            <Stack.Screen name="Regional Manager Coach Agenda" component={RegionalManagerCoachAgenda} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
});
export default App;
