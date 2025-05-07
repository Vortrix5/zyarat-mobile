import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react'; // Import useState
import {
    FlatList, // Import Modal
    Image,
    Modal, // Import ScrollView
    Platform,
    SafeAreaView, // Import Image
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useKronodex } from '../../../contexts/KronodexContext';
import KronodexItem from './_components/KronodexItem';

export default function KronodexScreen() {
    const { kronodexItems, removeItemFromKronodex } = useKronodex();
    const [detailsModalVisible, setDetailsModalVisible] = useState(false); // State for modal visibility
    const [selectedItem, setSelectedItem] = useState(null); // State for the item to display in modal

    const handleRemoveItem = (id) => {
        // Consider adding a confirmation dialog here
        removeItemFromKronodex(id);
    };

    // Function to open the details modal
    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setDetailsModalVisible(true);
    };

    // Function to close the details modal
    const handleCloseDetailsModal = () => {
        setDetailsModalVisible(false);
        setSelectedItem(null); // Clear selected item
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleViewDetails(item)}> {/* Wrap item with TouchableOpacity */}
            <KronodexItem
                item={item}
                onRemove={() => handleRemoveItem(item.id)}
            />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {kronodexItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="archive-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyText}>Your Kronodex is empty.</Text>
                    <Text style={styles.emptySubText}>Scan artifacts to add them to your collection!</Text>
                </View>
            ) : (
                <FlatList
                    data={kronodexItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()} // Ensure key is a string
                    contentContainerStyle={styles.listContainer}
                />
            )}

            {/* Details Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={detailsModalVisible}
                onRequestClose={handleCloseDetailsModal}
            >
                <View style={styles.modalCenteredView}>
                    <View style={styles.modalView}>
                        {selectedItem && ( // Only render content if an item is selected
                            <>
                                <Image source={{ uri: selectedItem.imageUrl }} style={styles.modalImage} />
                                <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.modalScrollContent}>
                                    <Text style={styles.modalTitle}>{selectedItem.title}</Text>

                                    <View style={styles.modalDetailSection}>
                                        <View style={styles.modalDetailHeader}>
                                            <Ionicons name="time-outline" size={18} color="#007AFF" />
                                            <Text style={styles.modalDetailTitle}>Historical Period</Text>
                                        </View>
                                        <Text style={styles.modalDetailText}>{selectedItem.period}</Text>
                                    </View>

                                    <View style={styles.modalDetailSection}>
                                        <View style={styles.modalDetailHeader}>
                                            <Ionicons name="information-circle-outline" size={18} color="#007AFF" />
                                            <Text style={styles.modalDetailTitle}>Description</Text>
                                        </View>
                                        <Text style={styles.modalDetailText}>{selectedItem.description}</Text>
                                    </View>

                                    <View style={styles.modalDetailSection}>
                                        <View style={styles.modalDetailHeader}>
                                            <Ionicons name="star-outline" size={18} color="#007AFF" />
                                            <Text style={styles.modalDetailTitle}>Historical Significance</Text>
                                        </View>
                                        <Text style={styles.modalDetailText}>{selectedItem.significance}</Text>
                                    </View>
                                </ScrollView>

                                <TouchableOpacity
                                    onPress={handleCloseDetailsModal}
                                    style={[styles.modalButton, styles.confirmButton, styles.doneButton]}
                                >
                                    <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Done</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    listContainer: {
        padding: 15,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#aaa',
        marginTop: 15,
    },
    emptySubText: {
        fontSize: 15,
        color: '#bbb',
        marginTop: 5,
        textAlign: 'center',
    },

    // --- Modal Styles (similar to scan/results and explore/details) ---
    modalCenteredView: {
        flex: 1,
        justifyContent: 'flex-end', // Aligns modal to bottom
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalView: {
        width: '100%',
        maxHeight: '85%', // Limit modal height
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10, // Reduced top padding
        paddingBottom: Platform.OS === 'ios' ? 40 : 25, // Safe area padding for bottom
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2, // Shadow for top edge
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    modalImage: {
        width: '100%',
        height: 200, // Adjust height as needed
        borderTopLeftRadius: 20, // Match modal corners
        borderTopRightRadius: 20,
        marginBottom: 15,
    },
    modalScrollView: {
        width: '100%',
    },
    modalScrollContent: {
        paddingHorizontal: 25, // Padding for the text content
        paddingBottom: 15, // Padding before the button
    },
    modalTitle: {
        fontSize: 22, // Slightly larger title
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    modalDetailSection: { // Reusing styles from scan/results
        backgroundColor: "#F9F9F9", // Slightly different background for sections
        borderRadius: 10,
        padding: 16,
        marginBottom: 15,
    },
    modalDetailHeader: { // Reusing styles from scan/results
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    modalDetailTitle: { // Reusing styles from scan/results
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginLeft: 6,
    },
    modalDetailText: { // Reusing styles from scan/results
        fontSize: 15,
        color: "#444",
        lineHeight: 22,
    },
    modalButton: { // Generic button style from explore/details
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5, // Keep horizontal margin for potential row layout
        // flexGrow: 1, // Removed flexGrow for single button
        // flexBasis: 0, // Removed flexBasis
    },
    confirmButton: { // Confirm button style from explore/details
        backgroundColor: '#007AFF',
    },
    doneButton: { // Done button style for single button layout
        marginTop: 10, // Add margin top
        marginHorizontal: 25, // Match content padding
        width: '90%', // Make button slightly less than full width
        // flexGrow: 0, // Ensure no flex grow
        // flexBasis: 'auto', // Ensure no flex basis
    },
    modalButtonText: { // Generic text style from explore/details
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButtonText: { // Confirm text style from explore/details
        color: '#fff',
    },
});
