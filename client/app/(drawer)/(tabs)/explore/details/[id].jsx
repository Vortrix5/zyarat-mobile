import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Modal, Button, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTickets } from '../../../../../contexts/TicketsContext';
import { Image as ExpoImage } from 'expo-image';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const getDetailsById = (id, params) => {
  const priceRaw = params.price;
  let displayPrice;
  if (priceRaw === 'Free') {
    displayPrice = 'Free';
  } else if (priceRaw !== undefined && !isNaN(Number(priceRaw))) {
    displayPrice = `${Number(priceRaw)} TND`;
  } else {
    displayPrice = 'N/A';
  }

  return {
    id: id,
    title: params.title || 'Unknown Title',
    description: params.description || 'No description available.',
    imageUrl: params.imageUrl || 'https://via.placeholder.com/400x200',
    category: params.category || 'General',
    price: displayPrice,
    rawPrice: priceRaw,
    location: params.location || 'Unknown Location',
    extendedDescription: params.description + " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    openingHours: "9:00 AM - 5:00 PM",
  };
};

export default function ExploreDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { id } = params;
  const { addTicket } = useTickets();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [quantity, setQuantity] = useState(1);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const item = getDetailsById(id, params);
  const isFree = item.rawPrice === 'Free' || item.rawPrice === 0;
  const numericPrice = isFree ? 0 : Number(item.rawPrice) || 0;

  const handleOpenPurchaseModal = () => {
    setSelectedDate(new Date());
    setQuantity(1);
    setPurchaseComplete(false);
    setShowDatePicker(Platform.OS === 'ios');
    setModalVisible(true);
  };

  const onChangeDate = (event, date) => {
    const currentDate = date || selectedDate;
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (currentDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      Alert.alert("Invalid Date", "Please select a date from today onwards.");
      return;
    }
    setSelectedDate(currentDate);
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleConfirmPurchase = () => {
    if (!selectedDate) {
      Alert.alert("Please select a date.");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addTicket({
        eventId: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        location: item.location,
        eventDate: selectedDate,
        price: item.rawPrice,
      });
    }

    setPurchaseComplete(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const totalPrice = isFree ? 'Free' : `${(numericPrice * quantity).toFixed(2)} TND`;

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(drawer)/(tabs)/explore')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ExpoImage source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="pricetag-outline" size={16} color="#10B981" />
              <Text style={styles.metaText}>{item.price}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="grid-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{item.category}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.extendedDescription}</Text>

          <Text style={styles.sectionTitle}>Opening Hours</Text>
          <Text style={styles.description}>{item.openingHours}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.purchaseButton} onPress={handleOpenPurchaseModal}>
          <Text style={styles.purchaseButtonText}>
            {isFree ? 'Get Ticket' : 'Purchase Ticket'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView}>
            {!purchaseComplete ? (
              <>
                <Text style={styles.modalTitle}>Confirm Your Visit</Text>

                <Text style={styles.modalSectionTitle}>Select Date</Text>
                {Platform.OS === 'android' && (
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateDisplayButton}>
                    <Ionicons name="calendar-outline" size={18} color="#007AFF" style={{ marginRight: 8 }} />
                    <Text style={styles.dateDisplayText}>{selectedDate.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                )}
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onChangeDate}
                    minimumDate={new Date(new Date().setHours(0, 0, 0, 0))}
                    style={styles.datePicker}
                    themeVariant={Platform.OS === 'ios' ? 'light' : undefined}
                  />
                )}

                <Text style={styles.modalSectionTitle}>Quantity</Text>
                <View style={styles.quantitySelector}>
                  <TouchableOpacity onPress={() => handleQuantityChange(-1)} style={styles.quantityButton} disabled={quantity <= 1}>
                    <Ionicons name="remove-circle-outline" size={28} color={quantity <= 1 ? '#ccc' : '#007AFF'} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity onPress={() => handleQuantityChange(1)} style={styles.quantityButton}>
                    <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
                  </TouchableOpacity>
                </View>

                {!isFree && (
                  <View style={styles.totalPriceContainer}>
                    <Text style={styles.totalPriceLabel}>Total:</Text>
                    <Text style={styles.totalPriceValue}>{totalPrice}</Text>
                  </View>
                )}

                <Text style={styles.paymentNotice}>
                  <Ionicons name="information-circle-outline" size={14} color="#555" />
                  {' '}Payment will be processed on-site at the venue.
                </Text>

                <View style={styles.modalButtonRow}>
                  <TouchableOpacity onPress={handleCloseModal} style={[styles.modalButton, styles.cancelButton]}>
                    <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleConfirmPurchase} style={[styles.modalButton, styles.confirmButton]}>
                    <Text style={[styles.modalButtonText, styles.confirmButtonText]}>
                      {isFree ? 'Confirm' : 'Confirm Purchase'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={60} color="#4CD964" style={{ marginBottom: 15 }} />
                <Text style={styles.modalTitle}>Success!</Text>
                <Text style={styles.successText}>
                  Your ticket{quantity > 1 ? 's' : ''} for {item.title} on {selectedDate.toLocaleDateString()} {quantity > 1 ? `(x${quantity})` : ''} ha{quantity > 1 ? 've' : 's'} been confirmed.
                </Text>
                <TouchableOpacity onPress={handleCloseModal} style={[styles.modalButton, styles.confirmButton, styles.doneButton]}>
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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 15,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  image: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  metaText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    color: '#444',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
    marginBottom: 15,
  },
  footer: {
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  purchaseButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCenteredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: 15,
  },
  dateDisplayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  dateDisplayText: {
    fontSize: 16,
    color: '#333',
  },
  datePicker: {
    width: '100%',
    marginBottom: 15,
    height: Platform.OS === 'ios' ? 180 : undefined,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    width: '60%',
  },
  quantityButton: {
    padding: 10,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'center',
    marginHorizontal: 15,
    color: '#333',
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 15,
    width: '100%',
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentNotice: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    lineHeight: 18,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    width: '100%',
  },
  modalButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    flexGrow: 1,
    flexBasis: 0,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  doneButton: {
    marginTop: 20,
    marginHorizontal: 0,
    width: '100%',
    flexGrow: 0,
    flexBasis: 'auto',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#333',
  },
  confirmButtonText: {
    color: '#fff',
  },
  successText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
});
