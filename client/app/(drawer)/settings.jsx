import { View, Text, StyleSheet, SafeAreaView } from "react-native"; // Import SafeAreaView

export default function Settings() {
    return (
        // Wrap content in SafeAreaView as this screen gets a header from Drawer
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Title is provided by the Drawer header, no need to repeat */}
                {/* <Text style={styles.title}>Settings</Text> */}
                <Text>Adjust your app settings here.</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: { // Add style for SafeAreaView
        flex: 1,
        backgroundColor: '#fff', // Or your desired background
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    // title: { // Removed as title comes from header
    //     fontSize: 24,
    //     marginBottom: 20,
    // },
})

